import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";
import type { UpdateLpDto, ResponseLpDto } from "../../types/lp.ts";

/**
 * LP 수정 mutation 훅 (낙관적 업데이트)
 *
 * @description
 * LP의 정보를 수정할 때 사용하는 훅입니다.
 * 낙관적 업데이트(Optimistic Update)를 사용하여 서버 응답 전에 UI를 즉시 업데이트하고,
 * 에러 발생 시 이전 상태로 롤백합니다.
 *
 * @example
 * const { mutate: updateLpMutation } = useUpdateLp();
 * updateLpMutation({ lpId: 123, data: { title: "새 제목", content: "새 내용" } });
 */
export const useUpdateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, data }: { lpId: number; data: UpdateLpDto }) =>
      updateLp(lpId, data),

    /**
     * onMutate: mutation이 실행되기 직전에 호출
     * 서버 응답 전에 UI를 먼저 업데이트 (낙관적 업데이트)
     */
    onMutate: async ({ lpId, data }) => {
      // 1. 진행 중인 쿼리를 취소하여 낙관적 업데이트가 덮어씌워지지 않도록 함
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lpId],
      });

      // 2. 현재 LP 데이터를 캐시에서 가져옴 (롤백용)
      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
        QUERY_KEY.lps,
        lpId,
      ]);

      // 3. 새로운 LP 데이터 생성 (기존 데이터와 수정 데이터 병합)
      if (previousLpPost) {
        const newLpPost: ResponseLpDto = {
          ...previousLpPost,
          data: {
            ...previousLpPost.data,
            ...data,
            updatedAt: new Date().toISOString(), // 수정 시간 업데이트
          },
        };

        // 4. 업데이트된 데이터를 캐시에 즉시 반영 (UI 즉시 업데이트)
        queryClient.setQueryData([QUERY_KEY.lps, lpId], newLpPost);
      }

      // 5. 에러 시 롤백을 위해 이전 데이터 반환
      return { previousLpPost };
    },

    /**
     * onSuccess: mutation 성공 시 호출
     * 서버에서 받은 최신 데이터로 캐시 업데이트
     */
    onSuccess: (data, variables) => {
      // 서버에서 받은 실제 데이터로 캐시 업데이트
      queryClient.setQueryData([QUERY_KEY.lps, variables.lpId], data);
    },

    /**
     * onError: mutation 실패 시 호출
     * 이전 상태로 롤백
     */
    onError: (err, variables, context) => {
      console.error("LP 수정 오류:", err);
      // 에러 발생 시 이전 데이터로 되돌림
      if (context?.previousLpPost) {
        queryClient.setQueryData(
          [QUERY_KEY.lps, variables.lpId],
          context.previousLpPost
        );
      }
    },

    /**
     * onSettled: mutation 완료 후 항상 호출
     * 서버 데이터와 동기화
     */
    onSettled: async (data, error, variables) => {
      // LP 목록과 상세 정보 모두 새로고침
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.lps, variables.lpId],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.lps, "list"],
        }),
      ]);
    },
  });
};
