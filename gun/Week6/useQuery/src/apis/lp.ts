//TanStack Query에서 (useGetLPList)queryFn에 들어갈 비동기 함수


import type { PaginationDto } from "../type/common";
import type { ResponseLpListDto } from "../type/lp";
import { axiosInstance } from "./axios";


export const getLpList = async ( paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
    
    const { data } = await axiosInstance.get("/v1/lps", {params: paginationDto,}
        
);

return data;
};