import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLpComment } from "../../apis/comments";
import type { PAGINATION_ORDER } from "../../enums/common";

// mutation으로변경요청보내는흐름
export default function useDeleteComment(
  lpId: number,
  order: PAGINATION_ORDER
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { commentId: number }) =>
      deleteLpComment(lpId, payload.commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });
}
