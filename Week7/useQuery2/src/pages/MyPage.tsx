import { useAuth } from '../context/AutoContext.tsx';
import { useNavigate } from 'react-router-dom';

// access 토큰으로 유저 검증 페이지
const MyPage = () => {
    // 💡 userInfo?.data.name 와 userInfo?.data.email 사용 가능
    const { logout, userInfo } = useAuth();
    const navigate = useNavigate();

    // userInfo가 아직 로드되지 않았을 경우를 대비하여 기본값 설정
    const nickname = userInfo?.data?.name || '정보 로딩 중...';
    const email = userInfo?.data?.email || '정보 로딩 중...';


    const handleLogout = async () => {
        await logout();
        navigate("/");
    }

    return (
        // 1. ✨ 중앙 정렬 및 배경 카드 스타일 적용
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
                
                {/* 헤더 */}
                <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
                    마이페이지
                </h2>

                {/* 사용자 정보 섹션 */}
                <div className="space-y-4 text-left mb-8">
                    {/* 닉네임 */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">닉네임</div>
                        <div className="text-2xl font-bold text-gray-900">{nickname}</div>
                    </div>

                    {/* 이메일 */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">이메일</div>
                        <div className="text-lg font-semibold text-gray-700">{email}</div>
                    </div>
                </div>

                {/* 로그아웃 버튼 */}
                <button
                    className="
                        w-full 
                        mt-6 
                        py-3 
                        bg-red-500 
                        text-white 
                        text-lg 
                        font-semibold 
                        rounded-lg 
                        shadow-md 
                        transition duration-300 ease-in-out
                        hover:bg-red-600 
                        hover:shadow-lg
                        focus:outline-none focus:ring-4 focus:ring-red-300
                    "
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </div>
        </div>
    )
}
// ? optional이 있는 이유 : useEffect는 return문이 실행 먼저 되고 다음에 렌더링 됨 <=> 해결하기 위해 생김

export default MyPage;