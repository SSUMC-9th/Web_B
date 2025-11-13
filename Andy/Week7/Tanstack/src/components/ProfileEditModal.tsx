import { useState, useEffect } from "react";
import { useUpdateUser } from "../hooks/mutations/useUpdateUser.ts";
import type { ResponseMyInfoDto } from "../types/auth.ts";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: ResponseMyInfoDto["data"];
}

export const ProfileEditModal = ({ isOpen, onClose, userData }: ProfileEditModalProps) => {
  const [name, setName] = useState(userData.name);
  const [bio, setBio] = useState(userData.bio || "");
  const [avatar, setAvatar] = useState(userData.avatar || "");

  const { mutate: updateUser, isPending } = useUpdateUser();

  // userData가 변경될 때마다 폼 업데이트
  useEffect(() => {
    setName(userData.name);
    setBio(userData.bio || "");
    setAvatar(userData.avatar || "");
  }, [userData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateUser(
      {
        name,
        bio: bio || undefined,
        avatar: avatar || undefined,
      },
      {
        onSuccess: () => {
          alert("프로필이 성공적으로 수정되었습니다.");
          onClose();
        },
        onError: (error) => {
          console.error("프로필 수정 실패:", error);
          alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            프로필 수정
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 소개 */}
          <div>
            <label htmlFor="bio" className="block text-sm text-gray-400 mb-2">
              소개
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
              placeholder="자기소개를 입력하세요"
            />
          </div>

          {/* 프로필 이미지 URL */}
          <div>
            <label htmlFor="avatar" className="block text-sm text-gray-400 mb-2">
              프로필 이미지 URL
            </label>
            <input
              id="avatar"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* 미리보기 */}
          {avatar && (
            <div className="flex justify-center">
              <img
                src={avatar}
                alt="프로필 미리보기"
                className="w-24 h-24 rounded-full object-cover border-4 border-pink-500"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
