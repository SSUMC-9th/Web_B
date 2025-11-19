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
    // LP 생성 API 호출 함수 
    mutationFn: async (lpData: CreateLpRequest) => {
      const response = await createLp(lpData);
      return response;
    },
    // 성공 시 LP 목록 자동 동기화 (새 LP추가하자마자! 목록화면 자동 갱신)
    onSuccess: (data) => {
      console.log('useCreateLp: LP 생성 성공!', data.data);

      // LP 목록 쿼리 무효화 - 다시 불러오기 트리거
      // queryKey가 'lps'로 시작하는 모든 쿼리 무효화
      // (useGetLpListInfinite의 queryKey: ['lps', order, search])
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      console.log('useCreateLp: LP 목록 쿼리 무효화됨');
    },
    // 요청 실패 시 에러 메시지 출력
    onError: (error: any) => {
      console.error('useCreateLp: LP 생성 실패!', error);
      console.error('에러 상세:', error.response?.data);
    },
  });
}

export default useCreateLp;
