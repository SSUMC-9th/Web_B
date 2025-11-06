import useGetLpList from "../hooks/queries/useGetLpList.ts";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Lp } from "../types/lp.ts";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetLpList({ search });
  const { isAuthenticated, user } = useAuth();

  // data 구조: { data: { data: [...], nextCursor, hasNext }, message, ... }
  const lpList = data?.data?.data || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 환영 문구 섹션 - 로그인 상태에서만 표시 */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-pink-600 to-pink-500 py-6 px-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white">
              {user.name || user.email}님 반갑습니다.
            </h1>
            <p className="text-pink-100 mt-2">LP 컬렉션을 탐색해보세요</p>
          </div>
        </div>
      )}

      {/* 검색 섹션 */}
      <div className="bg-gray-800 py-6 px-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="LP 검색..."
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-gray-400">LP 목록을 불러오는 중...</p>
            </div>
          </div>
        ) : lpList.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400 text-center">표시할 LP가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lpList.map((lp: Lp) => (
              <div
                key={lp.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">♫</span>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white truncate">
                    {lp.title}
                  </h2>
                  {lp.content && (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                      {lp.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 플로팅 버튼 (+) - 우측 하단 */}
      {isAuthenticated && (
        <Link
          to="/protected/dashboard"
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 z-50"
          title="마이페이지"
        >
          +
        </Link>
      )}
    </div>
  );
};

export default HomePage;
