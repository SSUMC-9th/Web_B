import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '../../apis/comment';
import type { Comment } from '../../types/comment';

interface UseUpdateCommentParams {
  lpId: number;
}

interface UseUpdateCommentVariables {
  commentId: number;
  content: string;
}

/**
 * 댓글 수정 Mutation Hook
 * - 댓글 수정 API 호출
 * - 성공 시 댓글 목록 쿼리 자동으로 무효화 (refetch 트리거)
 * - loading, error, success 상태 자동 관리
 */
function useUpdateComment({ lpId }: UseUpdateCommentParams) {
  const queryClient = useQueryClient();

  return useMutation({
    // 댓글 수정 API 호출 함수
    mutationFn: async (variables: UseUpdateCommentVariables) => {
      const response = await updateComment(lpId, variables.commentId, variables.content);
      return response;
    },
    // 성공 시 댓글 목록 자동 동기화 (수정된 댓글이 즉시! 목록에 반영)
    onSuccess: (data: any) => {
      console.log('useUpdateComment: 댓글 수정 성공!', data.data);

      // 댓글 목록 쿼리 무효화 - 다시 불러오기 트리거
      // queryKey가 'lpComments'로 시작하고 lpId를 포함하는 모든 쿼리 무효화
      // (useGetComments의 queryKey: ['lpComments', lpId, order])
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
      console.log('useUpdateComment: 댓글 목록 쿼리 무효화됨');
    },
    // 요청 실패 시 에러 메시지 출력
    onError: (error: any) => {
      console.error('useUpdateComment: 댓글 수정 실패!', error);
      console.error('에러 상세:', error.response?.data);
    },
  });
}

export default useUpdateComment;
