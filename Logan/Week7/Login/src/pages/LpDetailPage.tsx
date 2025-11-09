import React from "react";
import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { Heart } from "lucide-react"; // 이 줄을 추
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import type { Likes } from "../tpyes/lp";
import { deleteLike, postLike } from "../apis/lp";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostLike from "../hooks/mutations/usePostLike";

const LpDetailPage = () => {
  const { lpId } = useParams(); //url에 있는 lpid(app.tsx url에 설정한거 과 동일하게값 가져오기

  const { accessToken } = useAuth();
  const {
    data: lp, // 별칭사용
    isPending,
    isError,
  } = useGetLpDetail({ lpId: Number(lpId) });

  // 내 정보를 불러온다.
  // mutate-> 비동기 요청을 실행하고, 콜백함수를 이용해 후속작업처리함
  // mutateAsync -> Promise를 반환해서 await사용가능
  const { data: me } = useGetMyInfo(accessToken);
  // mutate쓰기
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  // 이전 방법_1
  //   const handleLikeLp = async () => {
  //     await postLike({ lpId: Number(lpId) });
  //   };

  // 새로운 방법_2
  const handleLikeLp = () => {
    likeMutate({ lpId: Number(lpId) });
  };
  const handleDislikeLp = () => {
    disLikeMutate({ lpId: Number(lpId) });
  };

  // 좋아요 눌렀는지 안눌렀는지 여부확인
  // me가 잇는 시점은 as number.다?? -이부분 왜 그런지
  // 방법1
  const isLiked = lp?.data.likes
    .map((like: Likes) => like.userId)
    .includes(me?.data.id as number);
  // 방법2
  //   const isLiked = lp?.data.likes.some(
  //     (like: Likes) => like.userId === me?.data.id
  //   );

  if (isPending && isError) {
    return <></>;
  }

  return (
    <div className={"mt-12"}>
      <h1>{lp?.data.id}</h1>
      <h1>{lp?.data.title}</h1>
      <img src={lp?.data.thumbnail} alt={lp?.data.title} />
      <p>{lp?.data.content}</p>

      <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
        <Heart
          color={isLiked ? "red" : "black"}
          fill={isLiked ? "red" : "transparent"}
        />
      </button>
    </div>
  );
};

export default LpDetailPage;
