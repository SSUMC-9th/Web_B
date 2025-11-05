import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../type/common";
import { getLpList } from "../../apis/lp";

function useGetLpList({cursor, search, order, limit}:PaginationDto) {
    return useQuery({
        queryKey:["lps"],
        queryFn: () => getLpList ({
            cursor,
            search,
            order,
            limit,
        }),

        staleTime: 1000 * 60 *5,
        gcTime: 100 * 60 * 10,
        enabled: Boolean(search),
    });
}

export default useGetLpList;