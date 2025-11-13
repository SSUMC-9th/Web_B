import type { PaginationDto } from "../types/common";
import type {
  ResponseCommentListDto,
  ResponseCommentDto,
} from "../types/comment";
import { axiosInstance } from "./axios";

export const getLpComments = async (
  lpId: number,
  params: PaginationDto // { cursor?, limit?, order?(PAGINATION_ORDER) ... }
) => {
  const res = await axiosInstance.get<ResponseCommentListDto>(
    `/v1/lps/${lpId}/comments`,
    { params }
  );
  return res.data;
};

export const postLpComment = async (lpId: number, content: string) => {
  const res = await axiosInstance.post<ResponseCommentDto>(
    `/v1/lps/${lpId}/comments`,
    { content }
  );
  return res.data;
};

export const patchLpComment = async (
  lpId: number,
  commentId: number,
  content: string
) => {
  const res = await axiosInstance.patch<ResponseCommentDto>(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return res.data;
};

export const deleteLpComment = async (lpId: number, commentId: number) => {
  // 성공 여부만 쓰면 되므로 반환 타입 엄격할 필요 X
  const res = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return res.data;
};
