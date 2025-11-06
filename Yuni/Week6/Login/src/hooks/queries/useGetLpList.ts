import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common.ts";
import { getLpList } from "../../apis/lp.ts";
import { QUERY_KEYS } from "../../constants/key.ts";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEYS.lps, search],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),

      //데이터가 신선하다고 간주하는 시간 
      staleTime: 1000 * 60, // 1 minute

      //사용되지 않는(비활성 상태)인 쿼리 데이터가 캐시에 남아있는 시간
      gcTime: 1000 * 60 * 5, // 5 minutes

      //쿼리 요청이 실패했을 때 자동으로 재시도할 횟수를 지정 
    //   retry: 3,
  });
}

export default useGetLpList;
