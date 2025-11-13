import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp } from '../../apis/lp';
import type { CreateLpRequest } from '../../apis/lp';

/**
 * LP 생성 Mutation Hook
 * - LP 생성 API 호출
 * - 성공 시 LP 목록 쿼리 자동으로 무효화 (refetch 트리거)
 * - loading, error, success 상태 자동 관리
 */
function useCreateLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lpData: CreateLpRequest) => {
      const response = await createLp(lpData);
      return response;
    },
    onSuccess: (data) => {
      console.log('useCreateLp: LP 생성 성공!', data.data);

      // LP 목록 쿼리 무효화 - 다시 불러오기 트리거
      // queryKey가 'lps'로 시작하는 모든 쿼리 무효화
      // (useGetLpListInfinite의 queryKey: ['lps', order, search])
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      console.log('useCreateLp: LP 목록 쿼리 무효화됨');
    },
    onError: (error: any) => {
      console.error('useCreateLp: LP 생성 실패!', error);
      console.error('에러 상세:', error.response?.data);
    },
  });
}

export default useCreateLp;
