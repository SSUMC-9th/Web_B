// LP 목록 및 상세 조회
import type { PaginationDto } from "../types/common.ts";
import type { ResponseLpListDto, Lp } from "../types/lp.ts";
import type { CommonResponse } from "../types/common.ts";
import { axiosInstance } from "./axios.ts";

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
