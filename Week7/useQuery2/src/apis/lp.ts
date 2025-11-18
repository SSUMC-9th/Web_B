//TanStack Query에서 (useGetLPList)queryFn에 들어갈 비동기 함수


import type { RequestCommentsDto, RequestDeleteCommentDto, RequestPostCommentDto, RequestUpdateCommentDto, ResponseCommentListDto, ResponseDeleteCommentDto, ResponseUpdateCommentDto } from "../type/comment";
import type { PaginationDto } from "../type/common";
import type { RequestLpDto, RequestPostLpDto, RequestUpdateLpDto, ResponseDeleteLpDto, ResponseLikeLpDto, ResponseLpDto, ResponseLpListDto } from "../type/lp";
import { axiosInstance } from "./axios";


export const getLpList = async ( paginationDto: PaginationDto,): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get("/v1/lps", {params: paginationDto,});

    return data;
};

export const getLpDetail = async ({lpid,}:RequestLpDto) => {
    const{data} = await axiosInstance.get(`/v1/lps/${lpid}`);

    return data;
}

export const postLike = async ({lpid,}:RequestLpDto): Promise<ResponseLikeLpDto> => {
    const{data} = await axiosInstance.post(`/v1/lps/${lpid}/likes`);

    return data;
}

export const disLike = async ({lpid,}:RequestLpDto): Promise<ResponseLikeLpDto> => {
    const{data} = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);

    return data;
}

// [GET] 댓글 목록 조회: /v1/lps/{lpid}/comments
export const getComments = async ({
    lpid, 
    limit, 
    order
}: RequestCommentsDto): Promise<ResponseCommentListDto> => {
    
    // 💡 수정된 부분: limit과 order를 axios의 params로 전달합니다.
    const { data } = await axiosInstance.get(
        `/v1/lps/${lpid}/comments`, 
        { 
            params: {
                limit, // limit=30 이 쿼리 스트링으로 추가됨
                order, // order=desc 가 쿼리 스트링으로 추가됨
            }
        }
    );
    
    return data;
};

// [POST] 댓글 생성: /v1/lps/{lpid}/comments
export const postComment = async ({lpid, content}: RequestPostCommentDto): Promise<Comment> => {
    // ...
    const { data } = await axiosInstance.post(
        `/v1/lps/${lpid}/comments`,
        { content }
    );
    return data;
};

// [PATCH] 댓글 수정: /v1/lps/{lpid}/comments/{commentId} (새로 추가)
export const updateComment = async ({ lpid, commentId, content }: RequestUpdateCommentDto): Promise<ResponseUpdateCommentDto> => {
    const { data } = await axiosInstance.patch(
        `/v1/lps/${lpid}/comments/${commentId}`,
        { content } // 수정할 내용만 body에 담아 전송
    );
    return data;
};

// [DELETE] 댓글 삭제: /v1/lps/{lpid}/comments/{commentId} (새로 추가)
export const deleteComment = async ({ lpid, commentId }: RequestDeleteCommentDto): Promise<ResponseDeleteCommentDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/comments/${commentId}`);
    return data;
};

// ----------------------------------------------------------------------
// ⭐ LP 관련 주요 API (생성, 업데이트, 삭제) 추가 ⭐
// ----------------------------------------------------------------------

// [POST] LP 생성: /v1/lps
/**
 * 새 LP를 생성합니다.
 * @param requestBody LP 생성에 필요한 데이터 (title, content, tags 등)
 * @returns 생성된 LP 객체
 */
export const postLp = async (requestBody: RequestPostLpDto): Promise<ResponseLpDto> => {
    const { data } = await axiosInstance.post(`/v1/lps`, requestBody);
    return data;
};

// [PATCH] LP 정보 업데이트: /v1/lps/{lpid}
/**
 * 특정 LP의 정보를 업데이트합니다.
 * @param params {lpid}와 업데이트할 내용 (title, content, tags 등)
 * @returns 업데이트된 LP 객체
 */
export const updateLp = async ({ lpid, ...requestBody }: RequestUpdateLpDto): Promise<ResponseLpDto> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpid}`, requestBody);
    return data;
};

// [DELETE] LP 삭제: /v1/lps/{lpid}
/**
 * 특정 LP를 삭제합니다.
 * @param params {lpid}
 * @returns 삭제 성공 응답 (일반적으로 빈 응답 혹은 성공 메시지 포함)
 */
export const deleteLp = async ({ lpid }: RequestLpDto): Promise<ResponseDeleteLpDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}`);
    return data;
};