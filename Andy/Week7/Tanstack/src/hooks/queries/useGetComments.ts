import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/lp.ts";
import type { ResponseCommentListDto } from "../../types/lp.ts";

export const useGetComments = (lpId: number) => {
  return useQuery<ResponseCommentListDto>({
    queryKey: ["comments", lpId],
    queryFn: () => getComments(lpId),
    enabled: !!lpId,
  });
};
