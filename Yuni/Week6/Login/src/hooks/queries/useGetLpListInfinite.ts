import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp.ts";
import type { PaginationDto } from "../../types/common.ts";

interface UseGetLpListInfiniteParams {
  search?: string;
  order?: " asc" | "desc";
}

function useGetLpListInfinite({ search = "", order = "desc" }: UseGetLpListInfiniteParams) {
  return useInfiniteQuery({
    queryKey: ['lps', order, search],
    queryFn: async ({ pageParam = 0 }) => {
      const params: PaginationDto = {
        cursor: pageParam,
        search,
        order,
        limit: 10,
      };
      return getLpList(params);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNext && lastPage.data.nextCursor) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

export default useGetLpListInfinite;
