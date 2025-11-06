import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common.ts";
import { getLpList } from "../../apis/lp.ts";
import { QUERY_KEYS } from "../../constants/key.ts";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEYS.lps],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
  });
}

export default useGetLpList;
