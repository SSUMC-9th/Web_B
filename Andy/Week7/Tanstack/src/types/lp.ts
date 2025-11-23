import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;

  createdAt: string;
  updatedAt: string;
  author?: Author;
  tags: Tag[];
  likes: Likes[];
};

export type RequestLpDto = {
  lpId: number;
};

export type CreateLpDto = {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
};

export type ResponseLpDto = CommonResponse<Lp>;

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

export type ResponseCreateLpDto = CommonResponse<{
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}>;

export type UpdateLpDto = {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
};

export type ResponseUpdateLpDto = CommonResponse<{
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}>;

export type ResponseDeleteLpDto = CommonResponse<boolean>;

// Comment 관련 타입
export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  author?: Author;
  createdAt: string;
  updatedAt: string;
};

export type CreateCommentDto = {
  content: string;
};

export type UpdateCommentDto = {
  content: string;
};

export type ResponseCommentDto = CommonResponse<Comment>;

export type CommentListData = {
  data: Comment[];
  nextCursor: number;
  hasNext: boolean;
};

export type ResponseCommentListDto = CommonResponse<CommentListData>;

export type DeleteCommentData = {
  message: string;
};

export type ResponseDeleteCommentDto = CommonResponse<DeleteCommentData>;
