import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestLpDto, ResponseLikeLpDto } from "../../tpyes/lp";

function usePostLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLike,

    // data ->API 성공 응답데이터
    // variables -> mutate에 전달한 값
    // context-> onMutate에서 반환한 값
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      });
    },

    // error: 요청 실패시 발생한 에러
    // variables-> mutate에 전달한 값
    // context -> onMutate에서 반환한 값
    onError: (error: Error, variables: RequestLpDto, context) => {},

    // 요청 직전에 실행된다, 좋아유 눌리기 직전에 실행된다.
    onMutate: (variables: RequestLpDto) => {
      return "hello";
    },
    // 요청이 끝난 후 항상 실행됨( OnSuccess, onError후에 실행됨)
    // 로딩상태를 초기화할때 조금 유용하다.
    onSettled: (
      data: ResponseLikeLpDto | undefined,
      error: Error | null,
      variables: RequestLpDto,
      context
    ) => {},
  });
}

export default usePostLike;
