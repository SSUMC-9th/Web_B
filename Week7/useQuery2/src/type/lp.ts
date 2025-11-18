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

export type Lp = { 
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
    likes: Likes[];
};

export type RequestLpDto = {
    lpid: number;
}

// ⭐ 1. LP 생성 요청 DTO (POST /v1/lps)
// 태그는 문자열 배열로 전송됩니다.
export type RequestPostLpDto = {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[]; // 태그 이름 문자열 배열
    published: boolean;
};

// ⭐ 2. LP 업데이트 요청 DTO (PATCH /v1/lps/{lpid})
// lpid는 경로에 포함되며, 나머지 필드는 RequestPostLpDto와 동일하지만 모두 선택적입니다.
export type RequestUpdateLpDto = {
    lpid: number;
    title?: string;
    content?: string;
    thumbnail?: string;
    tags?: string[];
    published?: boolean;
};


export type ResponseLpDto = CommonResponse<Lp>;
export type ResponseLpListDto = CursorBasedResponse<Lp[]>;
export type ResponseLikeLpDto = CommonResponse<{
    id: number;
    userId: number;
    lpId: number;
}>;

// ⭐ 3. LP 삭제 응답 DTO (DELETE /v1/lps/{lpid})
// { "status": true, "statusCode": 201, "message": "요청이 성공했습니다.", "data": true }
export type ResponseDeleteLpDto = CommonResponse<true>;