import { useState } from "react";
import type { Comment } from "../types/comment.ts";
import { useAuth } from "../hooks/useAuth";
import useUpdateComment from "../hooks/mutations/useUpdateComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";

interface CommentItemProps {
  comment: Comment;
  lpId: number;
  onCommentDeleted: () => void;
}

export default function CommentItem({
  comment,
  lpId,
  onCommentDeleted,
}: CommentItemProps) {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);

  const isAuthor = user?.id === comment.authorId;

  // Mutation Hooks
  const { mutate: updateCommentMutate, isPending: isUpdating } = useUpdateComment({
    lpId,
  });

  const { mutate: deleteCommentMutate, isPending: isDeleting } = useDeleteComment({
    lpId,
  });

  const handleUpdate = () => {
    if (!editContent.trim()) {
      setError("댓글 내용을 입력해주세요");
      return;
    }

    if (editContent === comment.content) {
      setIsEditing(false);
      return;
    }

    setError("");
    updateCommentMutate(
      { commentId: comment.id, content: editContent.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
          setShowMenu(false);
          onCommentDeleted?.();
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || "댓글 수정에 실패했습니다");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!window.confirm("이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    setError("");
    deleteCommentMutate(
      { commentId: comment.id },
      {
        onSuccess: () => {
          setShowMenu(false);
          onCommentDeleted?.();
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || "댓글 삭제에 실패했습니다");
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
    setError("");
  };

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "방금 전";
      if (diffMins < 60) return `${diffMins}분 전`;
      if (diffHours < 24) return `${diffHours}시간 전`;
      if (diffDays < 30) return `${diffDays}일 전`;

      return d.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "날짜 미상";
    }
  };

  return (
    <div className="border-b border-gray-800 pb-4 mb-4">
      {/* 프로필 + 아이디 + 메뉴버튼 */}
      <div className="flex items-start gap-4">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
            {comment.author?.name?.[0]?.toUpperCase() || "?"}
          </div>
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1 min-w-0">
          {/* 아이디 + 시간 + 메뉴버튼 */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white text-sm">
                {comment.author?.name || "익명"}
              </p>
              <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
            </div>

            {/* 메뉴 버튼 (작성자만 표시) */}
            {isAuthor && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-400 hover:text-white transition p-1"
                  title="메뉴"
                >
                  ···
                </button>

                {/* 메뉴 드롭다운 */}
                {showMenu && (
                  <div className="absolute right-0 top-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-t-lg transition"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? "삭제 중..." : "삭제"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 댓글 내용 또는 수정 폼 */}
          {isEditing ? (
            <div className="mb-2">
              <textarea
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-sm"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50 text-white rounded text-xs transition"
                >
                  {isUpdating ? "수정 중..." : "저장"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded text-xs transition"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {/* 에러 메시지 */}
          {error && (
            <p className="text-xs text-red-400 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
