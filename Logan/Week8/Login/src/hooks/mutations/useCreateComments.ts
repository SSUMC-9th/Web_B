import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLpComment } from "../../apis/comments";
import type { PAGINATION_ORDER } from "../../enums/common";

export default function useCreateComment(
  lpId: number,
  order: PAGINATION_ORDER
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { content: string }) =>
      postLpComment(lpId, payload.content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });
}
