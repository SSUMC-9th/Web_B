import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";
import type { ResponseLpDto } from "../../types/lp.ts";

/**
 * LP 삭제 mutation 훅 (낙관적 업데이트)
 *
 * @description
 * LP를 삭제할 때 사용하는 훅입니다.
 * 낙관적 업데이트(Optimistic Update)를 사용하여 서버 응답 전에 UI를 즉시 업데이트하고,
 * 에러 발생 시 이전 상태로 롤백합니다.
 *
 * @example
 * const { mutate: deleteLpMutation } = useDeleteLp();
 * deleteLpMutation(123);
 */
export const useDeleteLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),

    /**
     * onMutate: mutation이 실행되기 직전에 호출
     * 서버 응답 전에 UI를 먼저 업데이트 (낙관적 업데이트)
     */
    onMutate: async (lpId) => {
      // 1. 진행 중인 쿼리를 취소하여 낙관적 업데이트가 덮어씌워지지 않도록 함
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lpId],
      });
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, "list"],
      });

      // 2. 현재 LP 데이터를 캐시에서 가져옴 (롤백용)
      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
        QUERY_KEY.lps,
        lpId,
      ]);

      // 3. LP 상세 페이지 캐시 제거 (UI에서 즉시 사라짐)
      queryClient.removeQueries({
        queryKey: [QUERY_KEY.lps, lpId],
      });

      // 4. 에러 시 롤백을 위해 이전 데이터 반환
      return { previousLpPost, lpId };
    },

    /**
     * onError: mutation 실패 시 호출
     * 이전 상태로 롤백
     */
    onError: (err, lpId, context) => {
      console.error("LP 삭제 오류:", err, lpId);
      // 에러 발생 시 이전 데이터로 복원
      if (context?.previousLpPost) {
        queryClient.setQueryData(
          [QUERY_KEY.lps, context.lpId],
          context.previousLpPost
        );
      }
    },

    /**
     * onSettled: mutation 완료 후 항상 호출
     * 서버 데이터와 동기화
     */
    onSettled: async () => {
      // LP 목록 새로고침 (삭제된 LP가 목록에서 제거됨)
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, "list"],
      });
    },
  });
};
