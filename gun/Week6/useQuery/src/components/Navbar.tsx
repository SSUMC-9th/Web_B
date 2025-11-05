import { Link } from "react-router-dom";
import { useAuth } from "../context/AutoContext";

const NavBar = () => {
  const { accessToken } = useAuth();  // accessToken 가져오기

  return (
    <nav className="flex gap-3 p-4">
       <Link 
       to="/" 
       className="text-gray-500 hover:text-gray-700">
        홈페이지
      </Link>
      {/* accessToken이 없을 때만 로그인과 회원가입 링크 표시 */}
      {!accessToken && (
        <>
          <Link
            to="/login"
            className="text-gray-500 hover:text-gray-700"
          >
            로그인
          </Link>
          <Link
            to="/signup"  
            className="text-gray-500 hover:text-gray-700"
          >
            회원가입
          </Link>
        </>
      )}

      {/* accessToken이 있을 때만 마이페이지 링크 표시 */}
      {accessToken && (
        <>
        <Link
          to="/user"
          className="text-gray-500 hover:text-gray-700"
        >
          마이페이지
        </Link>
         <Link
          to="/search"
          className="text-gray-500 hover:text-gray-700"
        >
          검색페이지
        </Link>
        </>
        
      )}
    </nav>
  );
};

export default NavBar;
