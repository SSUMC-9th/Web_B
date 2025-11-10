import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Sidebar from "./Sidebar";

const Navbar = () => {
  // 토큰이 들어있는 경우, 로그인페이지를 안띄우려고
  const { accessToken, me } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        {/* <Sidebar
          isOpen={false}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
        /> */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          SpinningSpnning Dolimpan
        </Link>
        <div className="space-x-6">
          {!accessToken && (
            <>
              <Link
                to={"/login"}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                로그인
              </Link>
              <Link
                to={"/signup"}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                회원가입
              </Link>
            </>
          )}
          {accessToken && (
            <>
              <span className="text-gray-700 dark:text-gray-300">
                {me?.name ?? "회원"}님 안녕하세요
              </span>
              <Link
                to="/my"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                마이페이지
              </Link>
            </>
          )}

          <Link
            to={"/search"}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            검색
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
