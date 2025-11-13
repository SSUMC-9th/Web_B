import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";
import type { CreateLpDto } from "../../types/lp.ts";

/**
 * LP 생성 mutation 훅
 *
 * @description
 * 새로운 LP를 생성하는 훅입니다.
 * LP 생성 후 자동으로 LP 목록을 새로고침하여 UI를 업데이트합니다.
 *
 * @example
 * const { mutate: createLp, isPending } = useCreateLp();
 * createLp({ title: "앨범명", content: "내용", tags: ["태그1"], published: true });
 */
export const useCreateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLpDto) => postLp(data),

    onSuccess: () => {
      // LP 목록 쿼리를 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, 'list'],
      });
    },
  });
};
