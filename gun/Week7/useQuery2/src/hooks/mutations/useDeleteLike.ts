import { useMutation } from "@tanstack/react-query";
import { disLike } from "../../apis/lp";
import type { Likes, RequestLpDto, ResponseLpDto } from "../../type/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseMyInfoDto } from "../../type/auth";


function useDeleteLike() {
    return useMutation( {
        mutationFn: disLike,
        onMutate: async (lp: RequestLpDto) => {
            // 1. 이 게시글에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
            await queryClient.cancelQueries({
            queryKey:[QUERY_KEY.lps, lp.lpid],
            });

            // 2. 현재 게시글의 데이터를 캐시에서 가져옴
            const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
                QUERY_KEY.lps, 
                lp.lpid,
            ]);
            
            // 게시글 데이터를 복사해서 NewLpPost라는 새로운 객체를 만듬
            // 오류 시 이전 상태 되돌림
            const newLpPost = {...previousLpPost};

            // 게시그에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치 찾기
            const me = queryClient.getQueryData<ResponseMyInfoDto>(([
                QUERY_KEY.myInfo
            ]))
            const userid = Number(me?.data.id);

            const likedindex = previousLpPost?.data.likes.findIndex(
                    (like: Likes) => like.userId === userid,
                ) ??-1;
            
            if (likedindex >= 0) {
                previousLpPost?.data.likes.splice(likedindex, 1);
            }
            else {
                const newLike = {
                    userId: userid, 
                    lpId:lp.lpid} as Likes;
                previousLpPost?.data.likes.push(newLike);
            }
            console.log(newLpPost);

            //업데이트된 게시글 데이터를 캐시에 저장
            queryClient.setQueryData([QUERY_KEY.lps, lp.lpid], newLpPost);


            return {previousLpPost, newLpPost};
            },

            onError:(err, newLp, context) => {
                console.log(err, newLp);
                queryClient.setQueryData(
                    [QUERY_KEY.lps, newLp.lpid],
                    context?.previousLpPost?.data.id,
                );
            },

            onSettled: async (data, error, variables, context) => {
                await queryClient.invalidateQueries( {
                    queryKey: [QUERY_KEY.lps, variables.lpid],
                });
            },
    });
}

export default useDeleteLike;