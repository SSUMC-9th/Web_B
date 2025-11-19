import { useQuery } from '@tanstack/react-query';
import { getComments } from '../../apis/lp'; // api.ts에서 함수를 import한다고 가정합니다.
import { QUERY_KEY } from '../../constants/key';
// 필요한 타입 정의들을 임포트합니다.
import type { RequestLpDto } from '../../type/lp'; 
import type { ResponseCommentListDto } from '../../type/comment';
import type { PAGINATION_ORDER } from '../../enums/common';


// 훅의 파라미터 타입 정의 (limit과 order 포함)
interface UseGetCommentsParams extends RequestLpDto {
    limit: number;
    order: PAGINATION_ORDER;
}


export const useGetComments = ({ 
    lpid, 
    limit, 
    order,
}: UseGetCommentsParams) => {
    // LP ID가 유효한 숫자가 아닐 경우 쿼리 비활성화
    const enabled = !!lpid && !isNaN(lpid);
    
    // API에 전달할 파라미터 객체
    const requestParams = {
        lpid,
        limit,
        order,
    };

    return useQuery<ResponseCommentListDto, Error>({
        // ⭐ 핵심 수정: queryKey에 limit과 order를 명시적으로 포함해야 합니다. ⭐
        // 이 파라미터들이 변경되면 새로운 캐시 키로 인식되어 API를 다시 호출합니다.
        queryKey: [QUERY_KEY.comments, requestParams],
        
        // requestParams 객체를 getComments에 전달하여 limit과 order가 적용되도록 합니다.
        queryFn: () => getComments(requestParams), 
        
        enabled,
        
        // 필요에 따라 staleTime, cacheTime 등을 설정할 수 있습니다.
    });
};