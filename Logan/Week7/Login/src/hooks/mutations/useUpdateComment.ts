import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLpComment } from "../../apis/comments";
import type { PAGINATION_ORDER } from "../../enums/common";

export default function useUpdateComment(
  lpId: number,
  order: PAGINATION_ORDER
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { commentId: number; content: string }) =>
      patchLpComment(lpId, payload.commentId, payload.content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });
}
