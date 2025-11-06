import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";

const HomeLayout = () => {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-6xl min-h-dvh flex flex-col rounded-2xl border border-black/10 shadow-sm overflow-hidden m-4">

        {/* 헤더(네브바 영역) */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-2xl font-semibold tracking-tight">
              <span className="text-[#b2dab1]">Gun</span>Page
            </div>
            <NavBar />
          </div>
        </header>

        {/* 메인 */}
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>

        {/* 푸터 */}
        <footer className="border-t bg-gray-700 text-gray-300">
          <div className="px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">© {year} Your Company. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="cursor-default select-none">이용약관</span>
              <span className="cursor-default select-none">개인정보처리방침</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomeLayout;
