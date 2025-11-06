import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../type/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({cursor, search, order, limit}: PaginationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, search, order,],
        queryFn: () => getLpList({
            cursor,
            search,
            order,
            limit,
        }),

        staleTime: 1000*60*5, // 5분
        gcTime: 100*60*10, // 10분
        // 조건에 따라 쿼리 실행 여부 제어
        // enabled: false,
        // refetchInterval: 100*60, //주식
        // retry: 쿼리 요청이 실패했을 때 자동으로 재시도할 횟수를 지정
        // 네트워크 오류 등 임시적인 문제를 보완할 수 있음
        // retry: 3,

        select: (data) => data.data.data,
    });
}

export default useGetLpList;