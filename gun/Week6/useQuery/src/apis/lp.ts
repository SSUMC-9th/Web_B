import type { PaginationDto } from "../type/common";
import type { ResponseLpListDto } from "../type/lp";
import { axiosInstance } from "./axios";


export const getLpList = async ( paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
    
    const { data } = await axiosInstance.get("/v1/lps", {params: paginationDto,}
        
);

return data;
};