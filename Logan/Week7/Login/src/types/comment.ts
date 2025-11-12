import type { CommonResponse, CursorBasedResponse } from "./common"; // 이미 있는 파일
import type { PAGINATION_ORDER } from "../enums/common"; // enum 이미 존재

export type CommentAuthor = {
  id: number;
  name: string | null;
  email: string;
  avatarUrl: string | null;
};

export type Comment = {
  id: number;
  lpId: number;
  content: string;
  author: CommentAuthor;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

// GET 목록
export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;

// 단건(POST/PATCH의 data)
export type ResponseCommentDto = CommonResponse<Comment>;
