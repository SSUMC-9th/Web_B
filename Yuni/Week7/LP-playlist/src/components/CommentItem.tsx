import { useState } from "react";
import { deleteComment } from "../apis/comment.ts";
import type { Comment } from "../types/comment.ts";
import { useAuth } from "../hooks/useAuth";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const isAuthor = user?.id === comment.authorId;

  const handleDelete = async () => {
    if (!window.confirm("이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");
      await deleteComment(lpId, comment.id);
      onCommentDeleted();
    } catch (err: any) {
      setError(err.response?.data?.message || "댓글 삭제에 실패했습니다");
    } finally {
      setIsDeleting(false);
    }
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
      {/* 프로필 + 아이디 + 삭제버튼 */}
      <div className="flex items-start gap-4">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
            {comment.author?.name?.[0]?.toUpperCase() || "?"}
          </div>
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1 min-w-0">
          {/* 아이디 + 시간 */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white text-sm">
                {comment.author?.name || "익명"}
              </p>
              <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
            </div>

            {/* 삭제 버튼 (작성자만 표시) */}
            {isAuthor && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            )}
          </div>

          {/* 댓글 내용 */}
          <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-xs text-red-400 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
