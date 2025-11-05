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
        <footer className="bg-gray-800 text-gray-300 border-t border-gray-600">
  <div className="px-6 py-8 max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    {/* 회사 정보 */}
    <p className="text-sm">
      © {new Date().getFullYear()} GUN company. All rights reserved.
    </p>
  </div>
</footer>

      </div>
    </div>
  );
};

export default HomeLayout;
