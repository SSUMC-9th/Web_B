import { Link } from "react-router-dom";
import { useAuth } from "../context/AutoContext";
// (NavBar에서는 useState/useEffect/getMyInfo 임포트가 필요 없습니다.)

const NavBar = () => {
  // userInfo를 함께 가져옵니다!
  const { accessToken, userInfo } = useAuth(); 

  // userInfo에서 사용자 ID 추출 (예: ResponseMyInfoDto 구조에 따라 'id'나 'userId'를 사용)
  // ResponseMyInfoDto가 { data: { id: string } } 형태라고 가정하고 userId를 추출합니다.
  const userId = userInfo?.data?.name || userInfo?.data?.email; 

  return (
    <nav className="flex gap-3 p-4">

       
       {/* ... 로그인/회원가입 링크 ... */}
       {!accessToken && (
        <>
          <Link to="/login" className="text-gray-500 hover:text-gray-700">로그인</Link>
          <Link to="/signup" className="text-gray-500 hover:text-gray-700">회원가입</Link>
        <Link to="/search" className="text-gray-500 hover:text-gray-700">🔎</Link>
        </>
       )}

       {/* 로그인 시 환영 메시지 및 링크 표시 */}
       {accessToken && (
        <>
        <div>
          {/* userId가 있으면 표시, 없으면 '로딩 중...' 표시 */}
          {userId ? (
            <span className="font-semibold text-blue-600">{userId}</span>
          ) : (
            <span>로딩 중...</span>
          )}님 반갑습니다
        </div>
        <Link to="/user" className="text-gray-500 hover:text-gray-700">마이페이지</Link>
        <Link to="/search" className="text-gray-500 hover:text-gray-700">🔎</Link>
        </>
       )}
    </nav>
  );
};

export default NavBar;