import React from "react";
import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { Heart, Pencil, Trash2 } from "lucide-react"; // ✨ 수정/삭제/좋아요 UI
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import type { Likes } from "../types/lp";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostLike from "../hooks/mutations/usePostLike";

// 날짜 정보 포맷
const formatDate = (d?: Date | string) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const LpDetailPage = () => {
  const { lpId } = useParams(); //url에 있는 lpid(app.tsx url에 설정한거 과 동일하게값 가져오기
  const { accessToken } = useAuth();

  const {
    data: lp,
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

  const handleLikeLp = () => likeMutate({ lpId: Number(lpId) });
  const handleDislikeLp = () => disLikeMutate({ lpId: Number(lpId) });

  // 좋아요 눌렀는지 안눌렀는지 여부확인
  // me가 잇는 시점은 as number.다?? -이부분 왜 그런지
  // 방법1
  const isLiked = lp?.data.likes
    .map((like: Likes) => like.userId)
    .includes(me?.data.id as number);

  // 소유자 여부: authorId만 있으므로 이렇게 판단(지금은 지우기)
  // const isOwner =
  //   lp?.data?.authorId != null && me?.data?.id === lp?.data?.authorId;

  if (isPending && isError) {
    return <></>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-10">
      {/* 카드 컨테이너 */}
      <div className="w-full max-w-3xl bg-[#1E1F22] rounded-2xl shadow-lg p-6">
        {/* 헤더: 작성자/업로드일 + 수정/삭제 */}
        <header className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* 간단한 아바타(고정 이니셜) */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-fuchsia-400 to-rose-400 flex items-center justify-center text-sm font-bold">
              LP
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white/90">
                작성자 #{lp?.data.authorId ?? "-"}
              </p>
              <p className="text-xs text-white/50">
                {formatDate(lp?.data.createdAt)}
              </p>
            </div>
          </div>

          {
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-sm text-white/80 hover:bg-white/5"
                aria-label="수정"
              >
                <Pencil size={12} />
                수정
              </button>
              <button
                className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-sm text-red-300 hover:bg-red-400/10"
                aria-label="삭제"
              >
                <Trash2 size={12} />
                삭제
              </button>
            </div>
          }
        </header>

        {/* 제목 */}
        <h1 className="mb-5 text-2xl font-bold tracking-tight text-white">
          {lp?.data.title}
        </h1>

        {/* 썸네일 */}
        <section className="mb-8">
          <div className="rounded-2xl bg-white/5 p-4">
            <img
              src={lp?.data.thumbnail}
              alt={lp?.data.title}
              className="mx-auto aspect-[4/3] w-full max-w-2xl rounded-xl object-cover shadow"
            />
          </div>
        </section>

        {/* 본문 */}
        <section className="mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#202225] p-5 leading-relaxed text-white/90">
            {lp?.data.content}
          </div>
        </section>

        {/* 태그 */}
        {lp?.data.tags?.length ? (
          <section className="mb-8 flex flex-wrap gap-2">
            {lp.data.tags.map((t) => (
              <span
                key={t.id}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
              >
                #{t.name}
              </span>
            ))}
          </section>
        ) : null}

        {/* 좋아요 */}
        <footer className="flex justify-center">
          <button
            onClick={isLiked ? handleDislikeLp : handleLikeLp}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#2a2d31] px-5 py-2.5 text-sm text-white/90 hover:bg-white/5"
            aria-label="좋아요"
          >
            <Heart
              className="transition-transform"
              color={isLiked ? "red" : "currentColor"}
              fill={isLiked ? "red" : "transparent"}
              size={18}
            />
            <span>{lp?.data.likes?.length ?? 0}</span>
            {/* ??: 왼쪽값이 null이나 undefined면 오른쪽값써라 */}
            <span className="sr-only">좋아요</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LpDetailPage;
