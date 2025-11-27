import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/lp.ts";
import type { ResponseDeleteCommentDto } from "../../types/lp.ts";

interface DeleteCommentParams {
  lpId: number;
  commentId: number;
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseDeleteCommentDto, Error, DeleteCommentParams>({
    mutationFn: ({ lpId, commentId }: DeleteCommentParams) =>
      deleteComment(lpId, commentId),
    onSuccess: (_, variables) => {
      // 댓글 목록 refetch
      queryClient.invalidateQueries({ queryKey: ["comments", variables.lpId] });
      queryClient.refetchQueries({ queryKey: ["comments", variables.lpId] });
    },
  });
};
