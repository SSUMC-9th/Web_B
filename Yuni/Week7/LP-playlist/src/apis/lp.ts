// LP 목록, 상세 조회, 및 생성
import type { PaginationDto } from "../types/common.ts";
import type { ResponseLpListDto, Lp } from "../types/lp.ts";
import type { CommonResponse } from "../types/common.ts";
import { axiosInstance } from "./axios.ts";

// LP 생성 요청 타입
export type CreateLpRequest = {
  title: string;
  content: string;
  thumbnail: string | null;
  tags: string[];
  published: boolean;
};

// LP 생성 응답 타입
export type CreateLpResponse = CommonResponse<{
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  tags: string[];
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}>;

// 좋아요 추가/취소 요청 타입
export type LikeRequest = {
  lpId: number;
};

// 좋아요 응답 타입
export type LikeResponse = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

export const getLpList = async (
    paginationDto: PaginationDto
):Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async (lpId: number): Promise<CommonResponse<Lp>> => {
  const { data } = await axiosInstance.get(`/lps/${lpId}`);
  return data;
};

/**
 * LP 생성 API
 * @param body LP 생성 요청 정보 (title, content, thumbnail, tags, published)
 * @returns 생성된 LP의 정보
 */
export const createLp = async (body: CreateLpRequest): Promise<CreateLpResponse> => {
  console.log('LP 생성 요청:', body);
  try {
    const { data } = await axiosInstance.post<CreateLpResponse>('/lps', body);
    console.log('LP 생성 성공:', data.data);
    return data;
  } catch (error: any) {
    console.error('LP 생성 실패 - 상태 코드:', error.response?.status);
    console.error('LP 생성 실패 - 서버 에러 메시지:', error.response?.data);
    console.error('LP 생성 실패 - 전체 에러 응답:', error.response);
    throw error;
  }
};

/**
 * 좋아요 추가 API
 * @param lpId LP ID
 * @returns 좋아요 정보
 */
export const addLike = async (lpId: number): Promise<LikeResponse> => {
  console.log('좋아요 추가 요청:', lpId);
  try {
    const { data } = await axiosInstance.post<LikeResponse>(`/lps/${lpId}/likes`);
    console.log('좋아요 추가 성공:', data.data);
    return data;
  } catch (error: any) {
    console.error('좋아요 추가 실패:', error.response?.data);
    throw error;
  }
};

/**
 * 좋아요 취소 API
 * @param lpId LP ID
 * @returns 좋아요 정보
 */
export const removeLike = async (lpId: number): Promise<LikeResponse> => {
  console.log('좋아요 취소 요청:', lpId);
  try {
    const { data } = await axiosInstance.delete<LikeResponse>(`/lps/${lpId}/likes`);
    console.log('좋아요 취소 성공:', data.data);
    return data;
  } catch (error: any) {
    console.error('좋아요 취소 실패:', error.response?.data);
    throw error;
  }
};
