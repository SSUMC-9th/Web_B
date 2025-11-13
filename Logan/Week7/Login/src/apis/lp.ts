import type { PaginationDto } from "../types/common";
import type {
  RequestLpDto,
  ResponseLikeLpDto,
  ResponseLpDto,
  ResponseLpListDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

// 1. 내 Lp정보 가져오기(스웨거참고)
export const getMyLps = async (
  cursor: number = 0,
  limit: number = 10,
  order: "asc" | "desc" = "desc",
  search: string = ""
): Promise<ResponseLpListDto> => {
  const res = await axiosInstance.get("/v1/lps/user", {
    params: { cursor, limit, order, search },
  });
  return res.data;
};

// export const getMyLps = async (): Promise<ResponseLpListDto> => {
//   const {data} = await axiosInstance.get("/v1/lps/users");
//   return data; // 서버 샘플처럼 { status, statusCode, message, data: { data: Lp[] } }
// };

// 2. lp생성 api
// src/apis/lp.ts

export type CreateLpJson = {
  title: string;
  content: string;
  thumbnail: string; // 업로드 후 받은 URL
  tags: string[];
  published: boolean;
};

export const createLp = async (body: CreateLpJson) => {
  const res = await axiosInstance.post("/v1/lps", body, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getLpDetail = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`v1/lps/${lpId}`);

  return data;
};

export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`v1/lps/${lpId}/likes`);

  return data;
};

export const deleteLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`v1/lps/${lpId}/likes`);

  return data;
};
