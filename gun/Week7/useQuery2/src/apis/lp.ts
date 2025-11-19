//TanStack Query에서 (useGetLPList)queryFn에 들어갈 비동기 함수


import type { PaginationDto } from "../type/common";
import type { RequestLpDto, ResponseLikeLpDto, ResponseLpListDto } from "../type/lp";
import { axiosInstance } from "./axios";


export const getLpList = async ( paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
    
    const { data } = await axiosInstance.get("/v1/lps", {params: paginationDto,}
        
);

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