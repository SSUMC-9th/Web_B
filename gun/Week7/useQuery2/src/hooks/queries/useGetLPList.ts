import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../type/common";
import { getLpList } from "../../apis/lp";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
    
    const queryKey = ["lps", { cursor, search, order, limit }]; 

    const queryOptions = {
        queryKey: queryKey,
        queryFn: () => getLpList({ cursor, search, order, limit }),
        
        // ⭐⭐ enabled 옵션을 추가하여 쿼리 실행 조건을 명시 (디버깅 목적)
        enabled: true, // 기본적으로 true로 설정하여 항상 실행

        staleTime: 1000 * 60 * 5,
        gcTime: 100 * 60 * 10,   
        refetchInterval: 100 * 60,
        retry: 3,
    };

    // 🌟🌟🌟 콘솔 로그를 추가하여 쿼리 키를 확인
    console.log("useGetLpList running with key:", queryKey); 

    return useQuery(queryOptions);
}

export default useGetLpList;