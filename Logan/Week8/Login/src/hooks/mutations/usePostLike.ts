import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type {
  Likes,
  RequestLpDto,
  ResponseLikeLpDto,
  ResponseLpDto,
} from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

function usePostLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLike,

    // onMutate-> API요청 이전에 호출되는 친구
    // UI에 바로 변경을 보여주기 위해 캐시 업데이트

    onMutate: async (lp: RequestLpDto) => {
      // 1. 이 게시글에 관련된 쿼리를 취소( 캐시된 데이터를 새로 불러오는 요청)
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp.lpId],
      });

      // 2. 현재 게시글의 데이터를 캐시에서 가져와야해
      const previousLpPost: ResponseLpDto | undefined =
        queryClient.getQueryData<ResponseLpDto>([QUERY_KEY.lps, lp.lpId]);

      // 게시글 데이터를 복사해서 NewLpPost라는 새로운 객체를 만들거임
      // 복사하는 가장 콘 이유는 나중에오류가 발생했을때 이전상태로 되돌리기 위함
      const newLpPost = { ...previousLpPost };

      // 게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던
      // 좋아요의 위치를 찾을 수 있어야한다.
      // why..
      const me = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);
      //console.log(me?.data.id);
      const userId = Number(me?.data.id);

      const likedIndex: number | undefined =
        previousLpPost?.data.likes.findIndex(
          (like: Likes) => like.userId === userId
        ) ?? -1;
      //console.log(likedIndex);

      if (likedIndex >= 0) {
        previousLpPost?.data.likes.splice(likedIndex, 1);
      } else {
        const newLike = { userId, lpId: lp.lpId } as Likes;
        previousLpPost?.data.likes.push(newLike);
      }
      console.log(newLpPost);

      // 업데이트된 게시글 데이터를 캐시에 저장
      // 이렇게 하면 ui가 바로 업데이트됨, 사용자가 변화를 확인할 수 있다.
      queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);

      return { previousLpPost, newLpPost };
    },

    onError: (err, newLp, context) => {
      console.log(err, newLp);
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLp.lpId],
        context?.previousLpPost?.data.id
      );
    },
  });
}

export default usePostLike;
