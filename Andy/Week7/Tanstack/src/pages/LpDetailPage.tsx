import { useParams, useNavigate } from "react-router-dom";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail.ts";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { Heart, Edit, Trash2, MessageCircle, Send, X, Check } from "lucide-react";
import usePostLike from "../hooks/mutations/usePostLike.ts";
import useDeleteLike from "../hooks/mutations/useDeleteLike.ts";
import { useDeleteLp } from "../hooks/mutations/useDeleteLp.ts";
import { EditLpModal } from "../components/EditLpModal.tsx";
import { useState } from "react";
import { useGetComments } from "../hooks/queries/useGetComments.ts";
import { usePostComment } from "../hooks/mutations/usePostComment.ts";
import { useUpdateComment } from "../hooks/mutations/useUpdateComment.ts";
import { useDeleteComment } from "../hooks/mutations/useDeleteComment.ts";

export const LpDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const {
    data: lp,
    isPending,
    isError
  } = useGetLpDetail( {lpId: Number(lpid)} );

  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();
  const { mutate: deleteLpMutate, isPending: isDeleting } = useDeleteLp();

  // 댓글 관련
  const { data: commentsData, isPending: isCommentsLoading } = useGetComments(Number(lpid));
  const { mutate: postCommentMutate, isPending: isPostingComment } = usePostComment();
  const { mutate: updateCommentMutate, isPending: isUpdatingComment } = useUpdateComment();
  const { mutate: deleteCommentMutate } = useDeleteComment();

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

  // 댓글 작성 핸들러
  const handlePostComment = () => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) {
      return;
    }

    postCommentMutate(
      {
        lpId: Number(lpid),
        commentData: { content: commentContent },
      },
      {
        onSuccess: () => {
          setCommentContent("");
        },
        onError: (error: any) => {
          console.error("댓글 작성 오류:", error);
        },
      }
    );
  };

  // 댓글 수정 모드 시작
  const handleStartEditComment = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(currentContent);
  };

  // 댓글 수정 취소
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // 댓글 수정 제출
  const handleUpdateComment = (commentId: number) => {
    if (!editingCommentContent.trim()) {
      return;
    }

    updateCommentMutate(
      {
        lpId: Number(lpid),
        commentId,
        commentData: { content: editingCommentContent },
      },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditingCommentContent("");
        },
        onError: (error: any) => {
          console.error("댓글 수정 오류:", error);
        },
      }
    );
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId: number) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    deleteCommentMutate(
      {
        lpId: Number(lpid),
        commentId,
      },
      {
        onError: (error: any) => {
          console.error("댓글 삭제 오류:", error);
        },
      }
    );
  };

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

        {/* 댓글 섹션 */}
        <div className="mt-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-6 h-6 text-pink-500" />
              <h2 className="text-2xl font-bold text-white">
                댓글 {Array.isArray(commentsData?.data?.data) ? commentsData.data.data.length : 0}개
              </h2>
            </div>

            {/* 댓글 작성 폼 */}
            <div className="mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isPostingComment) {
                      handlePostComment();
                    }
                  }}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                  disabled={isPostingComment}
                />
                <button
                  onClick={handlePostComment}
                  disabled={isPostingComment || !commentContent.trim()}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isPostingComment ? "작성 중..." : "작성"}
                </button>
              </div>
            </div>

            {/* 댓글 목록 */}
            {isCommentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !Array.isArray(commentsData?.data?.data) || commentsData.data.data.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>아직 댓글이 없습니다.</p>
                <p className="text-sm mt-2">첫 번째 댓글을 작성해보세요!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {commentsData.data.data.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {/* 작성자 아바타 */}
                        {comment.author?.avatar ? (
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                            {comment.author?.name.charAt(0) || "?"}
                          </div>
                        )}

                        {/* 댓글 내용 */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">
                              {comment.author?.name || "알 수 없음"}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "ko-KR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>

                          {/* 수정 모드 */}
                          {editingCommentId === comment.id ? (
                            <div className="flex gap-2 items-center mt-2">
                              <input
                                type="text"
                                value={editingCommentContent}
                                onChange={(e) => setEditingCommentContent(e.target.value)}
                                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                                disabled={isUpdatingComment}
                              />
                              <button
                                onClick={() => handleUpdateComment(comment.id)}
                                disabled={isUpdatingComment}
                                className="p-2 text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                                aria-label="수정 완료"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={handleCancelEditComment}
                                disabled={isUpdatingComment}
                                className="p-2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                                aria-label="수정 취소"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-gray-300">{comment.content}</p>
                          )}
                        </div>
                      </div>

                      {/* 수정/삭제 버튼 (작성자만) */}
                      {me?.data.id === comment.authorId && editingCommentId !== comment.id && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStartEditComment(comment.id, comment.content)}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                            aria-label="댓글 수정"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            aria-label="댓글 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
