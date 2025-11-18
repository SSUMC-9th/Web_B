import { Link } from 'react-router-dom';
import { useAuth } from '../context/AutoContext'; // useAuth 훅 임포트 추가
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 임포트

const HomePage = () => {
    // 1. useAuth에서 accessToken과 logout 함수를 가져옵니다.
    const { accessToken, logout } = useAuth(); 
    const navigate = useNavigate();

    // 2. 로그아웃 처리 함수
    const handleLogout = async () => {
        await logout(); // AuthContext의 로그아웃 함수 호출
        navigate("/login"); // 로그아웃 후 로그인 페이지로 이동
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-800">

            {/* 🌟 메인 히어로 섹션 */}
            <section className="text-center py-16 px-4">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
                    <span className="text-[#b2dab1]">Gun</span>Page에 오신 것을 환영합니다!
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    당신의 **성장**과 **기록**을 위한 최고의 플랫폼. 지금 바로 시작하고 특별한 경험을 누려보세요.
                </p>

                {/* 3. 핵심 행동 유도 버튼: 조건부 렌더링 적용 */}
                <div className="flex justify-center gap-4">
                    
                    {/* 🔓 로그아웃 상태일 때 (회원가입/로그인 버튼) */}
                    {!accessToken ? (
                        <>
                            <Link 
                                to="/signup"
                                className="px-8 py-3 bg-[#b2dab1] text-gray-900 font-bold rounded-lg shadow-md hover:bg-[#97d896] transition duration-300 transform hover:scale-105"
                            >
                                회원가입
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-3 border border-[#b2dab1] text-[#b2dab1] font-bold rounded-lg hover:bg-gray-50 transition duration-300"
                            >
                                로그인
                            </Link>
                        </>
                    ) : (
                        // 🔒 로그인 상태일 때 (로그아웃 버튼)
                        <button
                            onClick={handleLogout}
                            className="px-8 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105"
                        >
                            로그아웃
                        </button>
                    )}
                </div>
            </section>
            
            {/* 📝 주요 특징 섹션 (생략) */}
            <section className="w-full max-w-4xl py-12 px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-700">우리의 특별한 가치</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* 특징 카드 1 */}
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
                        <div className="text-3xl mb-3">✍️</div>
                        <h3 className="text-xl font-semibold mb-2">손쉬운 기록</h3>
                        <p className="text-gray-500 text-sm">복잡함 없이 당신의 아이디어를 빠르게 정리하고 보관하세요.</p>
                    </div>

                    {/* 특징 카드 2 */}
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
                        <div className="text-3xl mb-3">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">강력한 검색</h3>
                        <p className="text-gray-500 text-sm">필요한 정보를 순식간에 찾아낼 수 있는 스마트 검색 기능.</p>
                    </div>

                    {/* 특징 카드 3 */}
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
                        <div className="text-3xl mb-3">🔒</div>
                        <h3 className="text-xl font-semibold mb-2">보안 걱정 끝</h3>
                        <p className="text-gray-500 text-sm">당신의 소중한 데이터는 항상 안전하게 보호됩니다.</p>
                    </div>
                    
                </div>
            </section>

        </div>
    );
}

export default HomePage;