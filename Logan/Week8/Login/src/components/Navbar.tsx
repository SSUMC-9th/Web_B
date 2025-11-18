// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// import Sidebar from "./Sidebar";

// const Navbar = () => {
//   // 토큰이 들어있는 경우, 로그인페이지를 안띄우려고
//   const { accessToken, me } = useAuth();

//   return (
//     <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10">
//       <div className="flex items-center justify-between p-4">
//         {/* <Sidebar
//           isOpen={false}
//           onClose={function (): void {
//             throw new Error("Function not implemented.");
//           }}
//         /> */}
//         <Link
//           to="/"
//           className="text-xl font-bold text-gray-900 dark:text-white"
//         >
//           SpinningSpnning Dolimpan
//         </Link>
//         <div className="space-x-6">
//           {!accessToken && (
//             <>
//               <Link
//                 to={"/login"}
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
//               >
//                 로그인
//               </Link>
//               <Link
//                 to={"/signup"}
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
//               >
//                 회원가입
//               </Link>
//             </>
//           )}
//           {accessToken && (
//             <>
//               <span className="text-gray-700 dark:text-gray-300">
//                 {me?.name ?? "회원"}님 안녕하세요
//               </span>
//               <Link
//                 to="/my"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
//               >
//                 마이페이지
//               </Link>
//             </>
//           )}

//           <Link
//             to={"/search"}
//             className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
//           >
//             검색
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type NavbarProps = {
  onOpenSidebar?: () => void; // ✅ 추가
};

const Navbar = ({ onOpenSidebar }: NavbarProps) => {
  // ✅ 추가
  const { accessToken, me } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        {/* 햄버거 버튼 */}
        <button
          onClick={onOpenSidebar} // ✅ 추가
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="메뉴 열기"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>

        <Link
          to="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          SpinningSpnning Dolimpan
        </Link>

        <div className="space-x-6">
          {!accessToken ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                회원가입
              </Link>
            </>
          ) : (
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
            to="/search"
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
