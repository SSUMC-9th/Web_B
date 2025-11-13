import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth.ts";
import { QUERY_KEY } from "../../constants/key.ts";

export const useGetMyInfo = (
  accessToken: string | null
) => {
  return useQuery( {
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });
}