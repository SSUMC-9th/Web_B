import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../context/AutoContext";

const NavBar = () => {
    const { accessToken, userInfo, logout } = useAuth(); 
    const userId = userInfo?.data?.name || userInfo?.data?.email; 

    const navigate = useNavigate();

    const handleLogout = async () => {
    await logout();
    navigate("/");
    }

  // 👈 링크에 적용할 새로운 디자인 클래스
  const linkStyle = "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200";

  return (
    <nav className="flex items-center gap-2 p-4"> {/* 👈 gap을 2로 줄여 버튼 간 간격을 좁힘 */}

       
       {/* --- 비회원 링크 --- */}
       {!accessToken && (
        <>
          {/* 1. 로그인 (포인트 스타일) */}
          <Link 
             to="/login" 
             className={`${linkStyle} bg-purple-600 text-white hover:bg-purple-700`} // 👈 보라색 배경 강조
          >
            로그인
          </Link>
          
          {/* 2. 회원가입 (은은한 스타일) */}
          <Link 
             to="/signup" 
             className={`${linkStyle} text-gray-200 hover:bg-gray-700`}
          >
            회원가입
          </Link>
          
          {/* 3. 검색페이지 (아이콘만) */}
        <Link 
             to="/search" 
             className={`${linkStyle} text-gray-200 hover:text-white hover:bg-gray-700`}
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
        <button className={`${linkStyle} bg-purple-600 text-white hover:bg-purple-700`} onClick = {handleLogout}>로그아웃</button>

        {/* 1. 마이페이지 (버튼 스타일) */}
        <Link 
           to="/user" 
           className={`${linkStyle} text-gray-200 hover:bg-gray-700`}
        >
          마이페이지
        </Link>
        {/* 2. 검색페이지 (아이콘만) */}
        <Link 
           to="/search" 
           className={`${linkStyle} text-gray-200 hover:text-white hover:bg-gray-700`}
        >
          🔎
        </Link>
        </>
       )}
    </nav>  
  );
};

export default NavBar;