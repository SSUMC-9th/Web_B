import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";
import type { Likes, RequestLpDto, ResponseLpDto } from "../../type/lp";
import type { ResponseMyInfoDto } from "../../type/auth";

function usePostLike() {
    return useMutation( {
        mutationFn: postLike,
        // data -> api 성공 응답데이터
        // variables -> mutate에 전달한 값
        // context -> onMutate에서 반환한 값

        //onMutate -> API 요청 이전에 호출되는 친구
        //UI에 바로 변경을 보여주기 위해 Cache 업데이트
        onMutate: async (lp: RequestLpDto) => {
            // 1. 이 게시글에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
            await queryClient.cancelQueries({
            //query_key.lps는 lps라는 이름, lpid(기본키)로 식별한다

            queryKey:[QUERY_KEY.lps, lp.lpid],
            });
            

            // 2. 현재 게시글의 데이터를 캐시에서 가져옴
            //query_key가 lps이고 lp의 lpid를 가져와서 previouslppost에 저장하겠다
            const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
                QUERY_KEY.lps, 
                lp.lpid,
            ]);
            
            // 게시글 데이터를 복사해서 NewLpPost라는 새로운 객체를 만듬
            const newLpPost = {...previousLpPost};

            // 게시그에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치 찾기
            
            // me 라는 객체에 로그인 된 사용자 정보를 가져옴
            const me = queryClient.getQueryData<ResponseMyInfoDto>(([
                QUERY_KEY.myInfo
            ]))
            // 그 me에서의 data.id를 불러오고 그 id를 userid라 칭함
            const userid = Number(me?.data.id);
            
            // 이전 데이터의 data.likes를 불러와서 그 userid와 me 에서의 userid가 같은지 확인
            const likedindex = previousLpPost?.data.likes.findIndex(
            // 요청한 데이터(게시글)의 좋아요한 유저들 배열을 불러오고 me에서의 userid와 같은지 확인하며
            // 같다면 그 유저의 좋아요 기록했던 인덱스를 반환
                    (like: Likes) => like.userId === userid,
                ) ??-1;
            // null 이거나 undefined 면 -1 할당
                
            //유저를 찾았다면(좋아요 기록이 있다면) previousLolikedindex 위치에 있는 요소를 제거
            if (likedindex >= 0) {
                previousLpPost?.data.likes.splice(likedindex, 1);
            }
            //유저를 못 찾았다면(좋아요 기록이 없다면)
            //likes에 Likes배열이 있어서 강제로 타입만들어준 newLike를
            else {
                const newLike = {
                    userId: userid, 
                    lpId:lp.lpid} as Likes;
                //배열의 맨 끝에 새로 만든 newLike 객체를 추가
                previousLpPost?.data.likes.push(newLike);
            }
            console.log(newLpPost);

            //서버 요청없이 업데이트된 게시글 캐시 데이터를 즉시 수정
            queryClient.setQueryData([QUERY_KEY.lps, lp.lpid], newLpPost);

            //에러뜰 때 previouslppost 반환해야하니까 return  
            return {previousLpPost, newLpPost};
            },

            // err: 실패 원인(디버깅 및 사용자 알림) 
            // newLp: 특정 게시글 정보(캐시 주소 식별)
            // context: 롤백 정보 저장소(원상 복구)
            onError:(err, newLp, context) => {
                console.log(err, newLp);
                //서버 요청없이 기존 게시글 바로 불러오기
                queryClient.setQueryData(
                    [QUERY_KEY.lps, newLp.lpid],
                    context?.previousLpPost
                );
            },
            // data: api 성공 응답 데이터
            // error: api 실패 응답 데이터
            // variables: 요청 변수
            // context: 롤백 정보 저장소

            onSettled: async (data, error, variables, context) => {
                //특정 쿼리 키 캐시 데이터 무효화 -> re-fetch 데이터 다시 가져오기
                //요청 변수(내가 고른 특정 lp 데이터)의 lpid를 리패치
                await queryClient.invalidateQueries( {
                    queryKey: [QUERY_KEY.lps, variables.lpid],
                });
            },
         });
        };


export default usePostLike;