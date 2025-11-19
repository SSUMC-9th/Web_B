import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../apis/comment';

interface UseCreateCommentParams {
  lpId: number;
}

interface UseCreateCommentVariables {
  content: string;
}

/**
 * 댓글 생성 Mutation Hook
 * - 댓글 생성 API 호출
 * - 성공 시 댓글 목록 쿼리 자동으로 무효화 (refetch 트리거)
 * - loading, error, success 상태 자동 관리
 */
function useCreateComment({ lpId }: UseCreateCommentParams) {
  const queryClient = useQueryClient();

  return useMutation({
    // 댓글 생성 API 호출 함수
    mutationFn: async (variables: UseCreateCommentVariables) => {
      const response = await createComment(lpId, variables.content);
      return response;
    },
    // 성공 시 댓글 목록 자동 동기화 (새 댓글이 작성되자마자! 목록 자동 갱신)
    onSuccess: (data: any) => {
      console.log('useCreateComment: 댓글 생성 성공!', data.data);

      // 댓글 목록 쿼리 무효화 - 다시 불러오기 트리거
      // queryKey가 'lpComments'로 시작하고 lpId를 포함하는 모든 쿼리 무효화
      // (useGetComments의 queryKey: ['lpComments', lpId, order])
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
      console.log('useCreateComment: 댓글 목록 쿼리 무효화됨');
    },
    // 요청 실패 시 에러 메시지 출력
    onError: (error: any) => {
      console.error('useCreateComment: 댓글 생성 실패!', error);
      console.error('에러 상세:', error.response?.data);
    },
  });
}

export default useCreateComment;
