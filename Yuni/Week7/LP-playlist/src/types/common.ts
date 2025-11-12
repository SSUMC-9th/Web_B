/**
 * 공통 API 응답 타입
 */
export type CommonResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

/**
 * 커서 기반 페이지네이션 응답 타입
 */
export type CursorBasedResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  nextCursor: number;
  hasNext: boolean;
};

/**
 * 페이지네이션 요청 타입
 */
export type PaginationDto = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: " asc" | "desc";
};
