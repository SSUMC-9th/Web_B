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
  console.log('📤 LP 생성 요청:', body);
  try {
    const { data } = await axiosInstance.post<CreateLpResponse>('/lps', body);
    console.log('✅ LP 생성 성공:', data.data);
    return data;
  } catch (error: any) {
    console.error('❌ LP 생성 실패:', error.response?.data);
    throw error;
  }
};
