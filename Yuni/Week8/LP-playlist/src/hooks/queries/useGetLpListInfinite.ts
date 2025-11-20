import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp.ts";
import type { PaginationDto } from "../../types/common.ts";
import useDebounce from "../useDebounce.ts";

interface UseGetLpListInfiniteParams {
  search?: string;
  order?: " asc" | "desc";
}

function useGetLpListInfinite({ search = "", order = "desc" }: UseGetLpListInfiniteParams) {
  // 검색어 debounce 처리 (300ms 지연)
  const debouncedSearch = useDebounce(search, 300);

  return useInfiniteQuery({
    // queryKey에 지연된 검색어 포함
    queryKey: ['lps', order, debouncedSearch],
    queryFn: async ({ pageParam = 0 }) => {
      const params: PaginationDto = {
        cursor: pageParam,
        search: debouncedSearch,
        order,
        limit: 10,
      };
      return getLpList(params);
    },
    getNextPageParam: (lastPage) => {
      // cursor/nextCursor 기반 페이지네이션
      if (lastPage.data.hasNext && lastPage.data.nextCursor) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    // 검색어가 있을 때만 쿼리 실행 (빈 검색어일 때는 쿼리 실행 안 함)
    enabled: !!debouncedSearch,
    initialPageParam: 0,
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5, // 5분
  });
}

export default useGetLpListInfinite;
