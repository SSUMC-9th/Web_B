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
