import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RequestPostLpDto, RequestUpdateLpDto, RequestLpDto, ResponseLpDto, ResponseDeleteLpDto } from "../../type/lp"; 
import { deleteLp, postLp, updateLp } from "../../apis/lp";

// ----------------------------------------------------------------------
// 1. LP 생성 (POST /v1/lps)
// ----------------------------------------------------------------------
/**
 * 새 LP를 생성하는 useMutation 훅입니다.
 * 성공 시 LP 목록 쿼리를 무효화하여 리스트를 새로고침합니다.
 */
export const usePostLp = () => {
    const queryClient = useQueryClient();

    return useMutation<ResponseLpDto, Error, RequestPostLpDto>({
        mutationFn: postLp,
        onSuccess: () => {
            // LP 목록 쿼리를 무효화 (주요 리스트 쿼리 키를 'lps'로 가정)
            queryClient.invalidateQueries({ queryKey: ['lps'] });
        },
        onError: (error) => {
            console.error("LP 생성 실패:", error);
            // 사용자에게 오류 메시지를 표시하는 로직을 여기에 추가할 수 있습니다.
        },
    });
};

// ----------------------------------------------------------------------
// 2. LP 정보 업데이트 (PATCH /v1/lps/{lpid})
// ----------------------------------------------------------------------
/**
 * 기존 LP 정보를 업데이트하는 useMutation 훅입니다.
 * 성공 시 LP 상세 및 목록 쿼리를 무효화합니다.
 */
export const useUpdateLp = () => {
    const queryClient = useQueryClient();

    return useMutation<ResponseLpDto, Error, RequestUpdateLpDto>({
        mutationFn: updateLp,
        onSuccess: (data, variables) => {
            // 1. 상세 LP 쿼리 무효화 (업데이트된 LP의 상세 페이지 캐시 업데이트)
            queryClient.invalidateQueries({ queryKey: ['lp', variables.lpid] });
            
            // 2. LP 목록 쿼리 무효화 (리스트 업데이트를 위해)
            queryClient.invalidateQueries({ queryKey: ['lps'] });
            
            // 3. (옵션) 캐시의 특정 항목을 직접 업데이트할 수도 있습니다.
            // queryClient.setQueryData(['lp', variables.lpid], data);
        },
        onError: (error) => {
            console.error("LP 업데이트 실패:", error);
        },
    });
};

// ----------------------------------------------------------------------
// 3. LP 삭제 (DELETE /v1/lps/{lpid})
// ----------------------------------------------------------------------
/**
 * 기존 LP를 삭제하는 useMutation 훅입니다.
 * 성공 시 LP 목록 쿼리를 무효화합니다.
 */
export const useDeleteLp = () => {
    const queryClient = useQueryClient();

    return useMutation<ResponseDeleteLpDto, Error, RequestLpDto>({
        mutationFn: deleteLp,
        onSuccess: () => {
            // LP 목록 쿼리를 무효화하여 삭제된 항목이 리스트에서 사라지게 합니다.
            queryClient.invalidateQueries({ queryKey: ['lps'] });
        },
        onError: (error) => {
            console.error("LP 삭제 실패:", error);
        },
    });
};