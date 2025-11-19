// CommonResponse, CursorBasedResponse가 정의된 파일에서 import
import type { PAGINATION_ORDER } from "../enums/common";
import type { CommonResponse, CursorBasedResponse } from "./common"; 

// ------------------------------------------------------------------
// 📌 1. Comment (댓글) 타입
// ------------------------------------------------------------------
// 실제 API에서 반환되는 단일 댓글 데이터 구조입니다.
export type Comment = {
    id: number;
    content: string;
    lpId: number;
    authorId: number;
    createdAt: string; // ISO 문자열 형식의 날짜
    updatedAt: string; // ISO 문자열 형식의 날짜
    
    // 작성자 정보 (UserBase 내용을 Comment 객체 내 author 필드에 직접 포함)
    author: {
        id: number;
        name: string;
        email: string;
        bio: string | null;
        avatar: string | null;
        createdAt: string; 
        updatedAt: string; 
    };
};

// ------------------------------------------------------------------
// 📌 2. Request (요청) DTO
// ------------------------------------------------------------------

// POST /v1/lps/{lpid}/comments 요청 본문 타입
export type RequestPostCommentDto = {
    lpid: number;
    content: string; // 댓글 내용
}

// PATCH /v1/lps/{lpid}/comments/{commentId} 요청 본문 타입 (새로 추가)
export type RequestUpdateCommentDto = {
    lpid: number;
    commentId: number;
    content: string; // 수정할 댓글 내용
}

// DELETE /v1/lps/{lpid}/comments/{commentId} 요청 본문 타입 (새로 추가)
export type RequestDeleteCommentDto = {
    lpid: number;
    commentId: number;
}

export type RequestCommentsDto = {
    lpid: number;
    limit?: number; // 한 페이지에 보여줄 항목 수 (기본값 설정 가능)
    order?: PAGINATION_ORDER; // 정렬 순서 ('asc' 또는 'desc')
}

// ------------------------------------------------------------------
// 📌 3. Response (응답) DTO
// ------------------------------------------------------------------

// POST /v1/lps/{lpid}/comments 응답: 생성된 단일 댓글 정보
export type ResponseCommentDto = CommonResponse<Comment>;

// GET /v1/lps/{lpid}/comments 응답: 댓글 목록
export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;

// PATCH /v1/lps/{lpid}/comments/{commentId} 응답: 수정된 단일 댓글 정보 (새로 추가)
// 수정 스웨거의 data는 생성 스웨거와 동일한 댓글 객체를 반환합니다.
export type ResponseUpdateCommentDto = ResponseCommentDto; 

// DELETE /v1/lps/{lpid}/comments/{commentId} 응답: 메시지 포함 (새로 추가)
export type ResponseDeleteCommentDto = CommonResponse<{
    message: string;
}>;