import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/lp.ts";
import type { CreateCommentDto, ResponseCommentDto } from "../../types/lp.ts";

interface PostCommentParams {
  lpId: number;
  commentData: CreateCommentDto;
}

export const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseCommentDto, Error, PostCommentParams>({
    mutationFn: ({ lpId, commentData }: PostCommentParams) =>
      postComment(lpId, commentData),
    onSuccess: (_, variables) => {
      // 댓글 목록 invalidate하여 즉시 반영
      queryClient.invalidateQueries({ queryKey: ["comments", variables.lpId] });
      // 강제로 refetch
      queryClient.refetchQueries({ queryKey: ["comments", variables.lpId] });
    },
  });
};
