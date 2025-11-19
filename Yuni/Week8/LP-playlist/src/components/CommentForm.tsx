import { useState } from "react";
import useCreateComment from "../hooks/mutations/useCreateComment";

interface CommentFormProps {
  lpId: number;
  onCommentAdded?: () => void;
}

export default function CommentForm({ lpId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { mutate: createCommentMutate, isPending: isLoading } = useCreateComment({
    lpId,
  });

  const maxLength = 500;
  const isValid = content.trim().length > 0 && content.length <= maxLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError("댓글은 1~500자 사이여야 합니다");
      return;
    }

    setError("");
    createCommentMutate(
      { content: content.trim() },
      {
        onSuccess: () => {
          setContent("");
          onCommentAdded?.();
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || "댓글 작성에 실패했습니다");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
      <h3 className="text-lg font-semibold mb-4">댓글 작성</h3>

      {/* 텍스트 입력 */}
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error) setError("");
        }}
        placeholder="댓글을 입력해주세요 (1~500자)"
        maxLength={maxLength}
        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
        rows={4}
      />

      {/* 문자 수 표시 */}
      <div className="text-right text-sm text-gray-400 mt-2 mb-4">
        {content.length}/{maxLength}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
      >
        {isLoading ? "작성 중..." : "댓글 작성"}
      </button>
    </form>
  );
}
