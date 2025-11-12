import type { CommentListResponse, Comment } from "../types/comment.ts";
import type { CommonResponse } from "../types/common.ts";
import { axiosInstance } from "./axios.ts";

export interface GetCommentsParams {
  lpId: number;
  cursor?: number;
  limit?: number;
  order?: "asc" | "desc";
}

export const getComments = async ({
  lpId,
  cursor = 0,
  limit = 10,
  order = "desc",
}: GetCommentsParams): Promise<CommentListResponse> => {
  const { data } = await axiosInstance.get(`/lps/${lpId}/comments`, {
    params: {
      cursor,
      limit,
      order,
    },
  });

  return data;
};

export const createComment = async (
  lpId: number,
  content: string
): Promise<CommonResponse<Comment>> => {
  const { data } = await axiosInstance.post(`/lps/${lpId}/comments`, {
    content,
  });

  return data;
};

export const deleteComment = async (
  lpId: number,
  commentId: number
): Promise<CommonResponse<null>> => {
  const { data } = await axiosInstance.delete(
    `/lps/${lpId}/comments/${commentId}`
  );

  return data;
};
