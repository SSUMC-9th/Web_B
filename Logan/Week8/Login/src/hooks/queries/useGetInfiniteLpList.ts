// import { useInfiniteQuery } from "@tanstack/react-query";
// import { getLpList } from "../../apis/lp";
// import type { PAGINATION_ORDER } from "../../enums/common";
// import { QUERY_KEY } from "../../constants/key";

// function useGetInfiniteLpList(
//   limit: number,
//   search: string,
//   order: PAGINATION_ORDER
// ) {
//   return useInfiniteQuery({

//     queryKey: [QUERY_KEY.lps, search, order],

//     queryFn: ({ pageParam }) =>
//       getLpList({ cursor: pageParam, limit, search, order }),

//     initialPageParam: 0,

//     getNextPageParam: (lastPage, allPages) => {
//       console.log(lastPage, allPages);
//       return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
//     },
//   });
// }

// export default useGetInfiniteLpList;

import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, { search, order, limit }],

    queryFn: ({ pageParam = 0 }) =>
      getLpList({ cursor: pageParam, limit, search, order }),

    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // 서버 응답 구조: lastPage.data.hasNext / lastPage.data.nextCursor
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    // 네트워크/포커스 변경 시 과도한 refetch 방지
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export default useGetInfiniteLpList;
