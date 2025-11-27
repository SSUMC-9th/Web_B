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
 * 검색어가 비어있거나 공백만 있을 경우 쿼리를 실행하지 않습니다.
 *
 * @param paginationDto - 페이지네이션 설정 (order, limit, search)
 * @returns useInfiniteQuery 결과 (data, fetchNextPage, hasNextPage, etc.)
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useGetLpList({ order: 'desc', limit: 10, search: '' });
 */
export const useGetLpList = (paginationDto: Omit<PaginationDto, 'cursor'>) => {
  // 검색어가 비어있거나 공백만 있는지 확인
  const isSearchEmpty = !paginationDto.search || paginationDto.search.trim() === '';

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, 'list', paginationDto],
    queryFn: ({ pageParam = 0 }) =>
      getLpList({ ...paginationDto, cursor: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    initialPageParam: 0,
    // 검색어가 비어있으면 항상 실행, 검색어가 있으면 공백이 아닐 때만 실행
    enabled: paginationDto.search === undefined || paginationDto.search === '' || !isSearchEmpty,
    // 데이터가 신선하다고 간주하는 시간 (5분)
    staleTime: 5 * 60 * 1000,
    // 가비지 컬렉션 시간 (10분)
    gcTime: 10 * 60 * 1000,
  });
}
