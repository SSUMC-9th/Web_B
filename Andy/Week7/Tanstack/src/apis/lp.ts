import { axiosInstance } from "./axios.ts";
import type { PaginationDto } from "../types/common.ts";
import type {
  RequestLpDto,
  ResponseLpDto,
  ResponseLikeLpDto,
  ResponseLpListDto,
  CreateLpDto,
  ResponseCreateLpDto,
  UpdateLpDto,
  ResponseUpdateLpDto,
  ResponseDeleteLpDto
} from "../types/lp.ts";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data
};

export const getLpDetail = async(
  { lpId }: RequestLpDto,
): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data
}

export const postLike = async(
  { lpId }: RequestLpDto,
): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data
}

export const deleteLike = async(
  { lpId }: RequestLpDto,
): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data
}

export const postLp = async(
  createLpDto: CreateLpDto
): Promise<ResponseCreateLpDto> => {
  const { data } = await axiosInstance.post("/v1/lps", createLpDto);

  return data;
}

export const updateLp = async(
  lpId: number,
  updateLpDto: UpdateLpDto
): Promise<ResponseUpdateLpDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, updateLpDto);

  return data;
}

export const deleteLp = async(
  lpId: number
): Promise<ResponseDeleteLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);

  return data;
}