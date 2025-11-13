import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from "../../constants/key.ts";
import type { PaginationDto } from "../../types/common.ts";
import { getLpList } from "../../apis/lp.ts";

/**
 * LP 목록 무한 스크롤 쿼리 훅
 *
 * @description
 * LP 목록을 페이지네이션으로 가져오는 훅입니다.
 * 무한 스크롤을 지원하며, 정렬 순서와 페이지당 항목 수를 지정할 수 있습니다.
 *
 * @param paginationDto - 페이지네이션 설정 (order, limit)
 * @returns useInfiniteQuery 결과 (data, fetchNextPage, hasNextPage, etc.)
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useGetLpList({ order: 'desc', limit: 10 });
 */
export const useGetLpList = (paginationDto: Omit<PaginationDto, 'cursor'>) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, 'list', paginationDto],
    queryFn: ({ pageParam = 0 }) =>
      getLpList({ ...paginationDto, cursor: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    initialPageParam: 0,
  });
}
