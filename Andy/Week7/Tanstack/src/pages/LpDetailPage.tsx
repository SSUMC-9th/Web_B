import { useParams, useNavigate } from "react-router-dom";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail.ts";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { Heart, Edit, Trash2 } from "lucide-react";
import usePostLike from "../hooks/mutations/usePostLike.ts";
import useDeleteLike from "../hooks/mutations/useDeleteLike.ts";
import { useDeleteLp } from "../hooks/mutations/useDeleteLp.ts";
import { EditLpModal } from "../components/EditLpModal.tsx";
import { useState } from "react";

export const LpDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    data: lp,
    isPending,
    isError
  } = useGetLpDetail( {lpId: Number(lpid)} );

  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();
  const { mutate: deleteLpMutate, isPending: isDeleting } = useDeleteLp();

  const isLiked = lp?.data.likes
    .map((like) => like.userId)
    .includes(me?.data.id as number);

  const handleLikeLp = () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    likeMutate({ lpId: Number(lpid) });
  }

  const handleDislikeLp = () => {
    disLikeMutate({ lpId: Number(lpid) });
  }

  const handleDeleteLp = () => {
    if (!window.confirm("정말로 이 LP를 삭제하시겠습니까?")) {
      return;
    }

    deleteLpMutate(Number(lpid), {
      onSuccess: () => {
        alert("LP가 삭제되었습니다.");
        navigate("/explore");
      },
      onError: (error: any) => {
        console.error("LP 삭제 오류:", error);
        alert(`LP 삭제에 실패했습니다: ${error.response?.data?.message || error.message}`);
      },
    });
  }

  // 현재 사용자가 작성자인지 확인
  const isAuthor = me?.data.id === lp?.data.authorId;

  if (isPending) {
    return (
      <div className="min-h-screen bg-black text-white px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-800 rounded-2xl mb-8"></div>
            <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !lp) {
    return (
      <div className="min-h-screen bg-black text-white px-8 py-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-red-400 text-xl mb-4">앨범을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          뒤로가기
        </button>

        {/* 앨범 정보 */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
          {/* 앨범 커버 */}
          <div className="aspect-square w-full overflow-hidden">
            <img
              src={lp.data.thumbnail}
              alt={lp.data.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 앨범 정보 */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  {lp.data.title}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {lp.data.content}
                </p>
              </div>

              {/* 액션 버튼들 */}
              <div className="ml-4 flex items-center gap-2">
                {/* 수정/삭제 버튼 (작성자만) */}
                {isAuthor && (
                  <>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-3 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-blue-400"
                      aria-label="LP 수정"
                    >
                      <Edit className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleDeleteLp}
                      disabled={isDeleting}
                      className="p-3 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="LP 삭제"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* 좋아요 버튼 */}
                <button
                  onClick={isLiked ? handleDislikeLp : handleLikeLp}
                  className="p-3 rounded-full hover:bg-gray-800 transition-colors"
                  aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                >
                  <Heart
                    className="w-8 h-8"
                    color={isLiked ? "#ec4899" : "#9ca3af"}
                    fill={isLiked ? "#ec4899" : "transparent"}
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>

            {/* 태그 */}
            {lp.data.tags && lp.data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {lp.data.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full text-sm border border-pink-500/30"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* 작성자 정보 */}
            {lp.data.author && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                {lp.data.author.avatar ? (
                  <img
                    src={lp.data.author.avatar}
                    alt={lp.data.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                    {lp.data.author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">{lp.data.author.name}</p>
                  {lp.data.author.bio && (
                    <p className="text-gray-400 text-sm">{lp.data.author.bio}</p>
                  )}
                </div>
              </div>
            )}

            {/* 통계 */}
            <div className="flex items-center gap-6 text-gray-400 text-sm pt-6 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{lp.data.likes.length} 좋아요</span>
              </div>
              <div>
                {new Date(lp.data.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* LP 수정 모달 */}
        {isEditModalOpen && (
          <EditLpModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            lp={lp.data}
          />
        )}
      </div>
    </div>
  )
}
