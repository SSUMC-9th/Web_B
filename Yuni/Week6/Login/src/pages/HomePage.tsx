import useGetLpList from "../hooks/queries/useGetLpList.ts";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import type { Lp } from "../types/lp.ts";

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<" asc" | "desc">("desc"); // 최신순(desc)이 기본값
  const { data, isLoading, error } = useGetLpList({ search, order: sortOrder });
  const { isAuthenticated, user } = useAuth();

  // data 구조: { data: { data: [...], nextCursor, hasNext }, message, ... }
  const lpList = data?.data?.data || [];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? " asc" : "desc");
  };

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '날짜 미상';
    }
  };

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

      {/* 검색 및 정렬 섹션 */}
      <div className="bg-gray-800 py-6 px-4 sticky top-0 z-10 border-b border-gray-700">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* 검색 입력 */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="LP 검색..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            {/* 정렬 버튼 */}
            <button
              onClick={toggleSortOrder}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-all duration-300 whitespace-nowrap"
            >
              {sortOrder === "desc" ? "📅 최신순" : "📅 오래된순"}
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message="LP 목록을 불러올 수 없습니다" />
        ) : lpList.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400 text-center">표시할 LP가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {lpList.map((lp: Lp) => (
              <div
                key={lp.id}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/lp/${lp.id}`)}
              >
                {/* 정사각형 카드 - Hover 시 확장 */}
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-pink-500/50">
                  {/* 앨범 아트 아이콘 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 text-6xl group-hover:text-gray-300 transition-colors duration-300">♫</span>
                  </div>

                  {/* 기본 상태: 제목만 표시 (카드 하단) */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 group-hover:opacity-0">
                    <h2 className="text-sm font-semibold text-white line-clamp-2">
                      {lp.title}
                    </h2>
                  </div>

                  {/* Hover 상태: 검정 오버레이 + 메타 정보 */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                    <div className="text-center space-y-3 w-full">
                      {/* 제목 */}
                      <h3 className="text-sm font-bold text-white line-clamp-2">
                        {lp.title}
                      </h3>

                      {/* 메타 정보 구분선 */}
                      <div className="w-8 h-0.5 bg-pink-500 mx-auto"></div>

                      {/* 업로드 날짜 */}
                      <div className="text-xs text-gray-300">
                        <span className="block text-gray-400 mb-1">📅 업로드</span>
                        <span>{formatDate(lp.createdAt)}</span>
                      </div>

                      {/* 좋아요 수 */}
                      <div className="text-xs text-gray-300">
                        <span className="block text-gray-400 mb-1">❤️ 좋아요</span>
                        <span className="text-pink-400 font-semibold">{lp.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
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
