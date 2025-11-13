import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth.ts";
import type { ResponseMyInfoDto } from "../types/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { ProfileEditModal } from "../components/ProfileEditModal.tsx";
import { DeleteAccountModal } from "../components/DeleteAccountModal.tsx";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto["data"] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchMyInfo = async () => {
    try {
      const response = await getMyInfo();
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    fetchMyInfo();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    // 모달 닫을 때 사용자 정보 다시 불러오기
    fetchMyInfo();
  };

  const handleDeleteSuccess = async () => {
    // 탈퇴 성공 시 로그아웃 처리
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            마이페이지
          </h1>
        </div>

        {/* 프로필 카드 */}
        <div className="max-w-2xl mx-auto">
          {data ? (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
              {/* 프로필 이미지 */}
              <div className="flex justify-center mb-6">
                {data.avatar ? (
                  <img
                    src={data.avatar}
                    alt="프로필 이미지"
                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-lg shadow-pink-500/30"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-pink-500/30">
                    {data.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>

              {/* 프로필 정보 */}
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-1">이름</div>
                  <div className="text-xl font-semibold text-white">{data.name}</div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-1">이메일</div>
                  <div className="text-xl font-semibold text-white">{data.email}</div>
                </div>

                {data.bio && (
                  <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-sm text-gray-400 mb-1">소개</div>
                    <div className="text-lg text-white">{data.bio}</div>
                  </div>
                )}

                {/* 버튼 그룹 */}
                <div className="space-y-4 pt-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      설정
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      로그아웃
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="text-red-500 hover:text-red-400 transition-colors text-sm underline underline-offset-2"
                    >
                      회원 탈퇴
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
              <div className="text-center text-gray-400 py-12 animate-pulse">
                불러오는 중...
              </div>
            </div>
          )}
        </div>

        {/* 프로필 수정 모달 */}
        {data && (
          <ProfileEditModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModal}
            userData={data}
          />
        )}

        {/* 회원 탈퇴 확인 모달 */}
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </div>
  );
};

export default MyPage;