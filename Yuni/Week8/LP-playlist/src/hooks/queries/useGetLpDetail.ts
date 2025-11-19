import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp.ts";

function useGetLpDetail(lpId: number) {
  return useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLpDetail(lpId),
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

export default useGetLpDetail;
