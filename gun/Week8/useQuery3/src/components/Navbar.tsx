import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AutoContext";

const NavBar = () => {
    const { accessToken, userInfo, logout } = useAuth(); 
    const userId = userInfo?.data?.name || userInfo?.data?.email; 

    const navigate = useNavigate();
    const location = useLocation();

    // 💡 현재 경로가 /user 인지 확인
    const isMyPageActive = location.pathname === '/user';
    // 💡 현재 경로가 /search 인지 확인 (새로 추가)
    const isSearchActive = location.pathname === '/search'; // 👈 검색 경로 확인

    const handleLogout = async () => {
        await logout();
        navigate("/");
    }

    // 👈 링크에 적용할 새로운 디자인 클래스
    const linkStyle = "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200";

    // ✅ 활성화된 버튼 스타일 정의
    const activeClass = "bg-purple-600 text-white shadow-md";
    // ✅ 비활성화된 버튼 스타일 정의
    // 검색 아이콘은 비활성화 상태일 때 회색 텍스트와 회색 배경 호버를 유지합니다.
    const inactiveClass = "text-gray-200 hover:bg-gray-700"; 
    const inactiveSearchClass = "text-gray-200 hover:text-white hover:bg-gray-700"; 

    return (
        <nav className="flex items-center gap-2 p-4">
            
            {/* --- 비회원 링크 --- */}
            {!accessToken && (
                <>
                    {/* 1. 로그인 (포인트 스타일) */}
                    <Link 
                        to="/login" 
                        className={`${linkStyle} ${location.pathname === '/login' ? activeClass : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                    >
                        로그인
                    </Link>
                    
                    {/* 2. 회원가입 (은은한 스타일) */}
                    <Link 
                        to="/signup" 
                        className={`${linkStyle} ${inactiveClass}`}
                    >
                        회원가입
                    </Link>
                    
                    {/* 3. 검색페이지 (아이콘만) - 조건부 스타일 적용 */}
                    <Link 
                        to="/search" 
                        className={`${linkStyle} ${isSearchActive ? activeClass : inactiveSearchClass}`} // 👈 적용
                    >
                        🔎
                    </Link>
                </>
            )}

            {/* --- 로그인 시 환영 메시지 및 링크 표시 --- */}
            {accessToken && (
                <>
                    <div>
                        {userId ? (
                            <span className="font-semibold text-purple-400">{userId}</span>
                        ) : (
                            <span className="text-gray-200">로딩 중...</span>
                        )}님 반갑습니다
                    </div>
                
                    {/* 0. 로그아웃 버튼 */}
                    <button 
                        className={`${linkStyle} ${activeClass}`} 
                        onClick={handleLogout}
                    >
                        로그아웃
                    </button>

                    {/* 1. 마이페이지 (버튼 스타일) - 조건부 스타일 적용 */}
                    <Link 
                        to="/user" 
                        className={`${linkStyle} ${isMyPageActive ? activeClass : inactiveClass}`}
                    >
                        마이페이지
                    </Link>
                    
                    {/* 2. 검색페이지 (아이콘만) - 조건부 스타일 적용 */}
                    <Link 
                        to="/search" 
                        className={`${linkStyle} ${isSearchActive ? activeClass : inactiveSearchClass}`} // 👈 적용
                    >
                        검색
                    </Link>
                </>
            )}
        </nav>  
    );
};

export default NavBar;