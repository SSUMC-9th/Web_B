import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../apis/lp.ts";
import type { UpdateCommentDto, ResponseCommentDto } from "../../types/lp.ts";

interface UpdateCommentParams {
  lpId: number;
  commentId: number;
  commentData: UpdateCommentDto;
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseCommentDto, Error, UpdateCommentParams>({
    mutationFn: ({ lpId, commentId, commentData }: UpdateCommentParams) =>
      updateComment(lpId, commentId, commentData),
    onSuccess: (_, variables) => {
      // 댓글 목록 invalidate하여 즉시 반영
      queryClient.invalidateQueries({ queryKey: ["comments", variables.lpId] });
      // 강제로 refetch
      queryClient.refetchQueries({ queryKey: ["comments", variables.lpId] });
    },
  });
};
