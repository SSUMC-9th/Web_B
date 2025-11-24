import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";
import type { Likes, ResponseLpDto } from "../../types/lp.ts";
import type { ResponseMyInfoDto } from "../../types/auth.ts";

/**
 * LP 좋아요 추가 mutation 훅 (낙관적 업데이트)
 *
 * @description
 * 사용자가 LP에 좋아요를 누를 때 사용하는 훅입니다.
 * 낙관적 업데이트(Optimistic Update)를 사용하여 서버 응답 전에 UI를 즉시 업데이트하고,
 * 에러 발생 시 이전 상태로 롤백합니다.
 *
 * @example
 * const { mutate: addLike } = usePostLike();
 * addLike({ lpId: 123 });
 */
function usePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLike,

    /**
     * onMutate: mutation이 실행되기 직전에 호출
     * 서버 응답 전에 UI를 먼저 업데이트 (낙관적 업데이트)
     */
    onMutate: async (lp) => {
      // 1. 진행 중인 쿼리를 취소하여 낙관적 업데이트가 덮어씌워지지 않도록 함
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp.lpId],
      });

      // 2. 현재 LP 데이터를 캐시에서 가져옴 (롤백용)
      const previousLpPost = queryClient.getQueryData<ResponseLpDto>(
        [QUERY_KEY.lps, lp.lpId]
      );

      // 3. 새로운 LP 데이터 객체 생성 (불변성 유지)
      const newLpPost = {...previousLpPost, ...lp};

      // 4. 현재 사용자 정보 가져오기
      const me = queryClient.getQueryData<ResponseMyInfoDto>(
        [QUERY_KEY.myInfo]
      );

      const userId = Number(me?.data.id);

      // 5. 좋아요 목록에서 현재 사용자의 좋아요 찾기
      const likedIndex = previousLpPost?.data.likes.findIndex(
        (like: Likes) => like.userId === userId
      ) ?? -1;

      // 6. 좋아요 추가
      if (likedIndex >= 0) {
        // 이미 좋아요가 있는 경우 (일반적으로 발생하지 않음)
        // 아무 작업도 하지 않음
      } else {
        // 좋아요가 없으면 추가
        const newLike = { userId, lpId: lp.lpId } as Likes;
        previousLpPost?.data.likes.push(newLike);
      }

      // 7. 업데이트된 데이터를 캐시에 즉시 반영 (UI 즉시 업데이트)
      queryClient.setQueryData(
        [QUERY_KEY.lps, lp.lpId], newLpPost
      );

      // 8. 에러 시 롤백을 위해 이전 데이터 반환
      return { previousLpPost, newLpPost };
    },

    /**
     * onError: mutation 실패 시 호출
     * 이전 상태로 롤백
     */
    onError: (
      err,
      newLp,
      context
    ) => {
      console.log(err, newLp);
      // 에러 발생 시 이전 데이터로 되돌림
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLp.lpId],
        context?.previousLpPost?.data.id,
      );
    },

    /**
     * onSettled: mutation 완료 후 항상 호출
     * 서버 데이터와 동기화
     */
    onSettled: async (
      data,
      error,
      variables
    ) => {
      // 최종적으로 서버에서 최신 데이터를 다시 가져옴
      await queryClient.invalidateQueries({
        queryKey:
          [QUERY_KEY.lps, variables.lpId],
      })
    }
  })
}

export default usePostLike;