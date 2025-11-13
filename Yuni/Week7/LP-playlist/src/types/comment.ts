import type { CursorBasedResponse } from "./common.ts";

export type Comment = {
  id: number;
  content: string;
  authorId: number;
  lpId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
};

export type CommentListResponse = CursorBasedResponse<{
  data: Comment[];
  nextCursor: number;
  hasNext: boolean;
}>;

// 댓글 생성 요청 타입
export type CreateCommentRequest = {
  content: string;
};

// 댓글 수정 요청 타입
export type UpdateCommentRequest = {
  content: string;
};

// 댓글 삭제 응답 타입
export type DeleteCommentResponse = {
  message: string;
};
