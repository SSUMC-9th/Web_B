import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLike, removeLike } from '../../apis/lp';

interface UseLikeParams {
  lpId: number;
}

/**
 * 좋아요 Mutation Hook (낙관적 업데이트 포함)
 * - onMutate: 서버 요청 전 즉시 좋아요 상태 변경 (낙관적 업데이트)
 * - mutationFn: 좋아요 추가/취소 API 호출
 * - onSuccess: 서버 응답 받은 후 최종 확인 업데이트
 * - onError: 실패 시 이전 상태로 롤백
 */
function useLike({ lpId }: UseLikeParams) {
  const queryClient = useQueryClient();

  return useMutation({
    // 요청 전: 낙관적 업데이트 (서버 응답 기다리지 않고 즉시 변경)
    onMutate: async (variables: { action: 'add' | 'remove' }) => {
      console.log('useLike: 낙관적 업데이트 시작', variables.action);

      // 현재 LP 상세 정보 조회
      const queryKey = ['lpDetail', lpId];
      const previousData = queryClient.getQueryData(queryKey);

      if (previousData) {
        // 캐시 즉시 업데이트
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData || !oldData.data || !oldData.data.likes) {
            return oldData;
          }

          const newLikes = [...oldData.data.likes];
          if (variables.action === 'add') {
            // 좋아요 추가 (중복 방지)
            if (!newLikes.find((like: any) => like.lpId === lpId)) {
              newLikes.push({ id: Date.now(), lpId, userId: 0 });
            }
          } else {
            // 좋아요 제거 (마지막 항목 제거 - 간단한 구현)
            newLikes.pop();
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              likes: newLikes,
            },
          };
        });

        console.log('useLike: 낙관적 업데이트 완료 (UI 즉시 반영)');
      }

      // 롤백용 데이터 반환
      return { previousData };
    },

    // 좋아요 추가/취소 API 호출
    mutationFn: async (variables: { action: 'add' | 'remove' }) => {
      if (variables.action === 'add') {
        return await addLike(lpId);
      } else {
        return await removeLike(lpId);
      }
    },

    // 성공 시: LP 상세 정보 다시 조회로 최종 확인
    onSuccess: () => {
      console.log('useLike: 좋아요 변경 성공! (서버 확인)');

      // LP 상세 정보 캐시 무효화 및 리페치
      queryClient.invalidateQueries({
        queryKey: ['lpDetail', lpId],
      });

      console.log('useLike: LP 상세 정보 리페치됨');
    },

    // 실패 시: 이전 상태로 롤백
    onError: (error: any, context: any) => {
      console.error('useLike: 좋아요 변경 실패!', error);
      console.error('에러 상세:', error.response?.data);

      // onMutate에서 저장한 이전 데이터로 롤백
      if (context?.previousData) {
        const queryKey = ['lpDetail', lpId];
        queryClient.setQueryData(queryKey, context.previousData);
        console.log('useLike: 이전 상태로 롤백됨');
      }
    },
  });
}

export default useLike;
