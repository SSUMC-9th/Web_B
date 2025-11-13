import useGetLpListInfinite from "../hooks/queries/useGetLpListInfinite.ts";
import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import SkeletonCard from "../components/SkeletonCard";
import type { Lp } from "../types/lp.ts";

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<" asc" | "desc">("desc"); // 최신순(desc)이 기본값
  const observerTarget = useRef<HTMLDivElement>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetLpListInfinite({
    search,
    order: sortOrder
  });
  const { isAuthenticated, user } = useAuth();

  // data 구조: pages 배열에서 각 페이지의 data.data에 LP 목록이 있음
  const lpList = data?.pages?.flatMap(page => page.data.data) || [];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? " asc" : "desc");
  };

  // Intersection Observer for infinite scroll
  const handleObserverCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // Set up Intersection Observer
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(handleObserverCallback, {
      threshold: 0.1,
    });

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [handleObserverCallback]);

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '날짜 미상';
    }
  };

  const handleImageError = (lpId: number) => {
    setFailedImages(prev => new Set(prev).add(lpId));
  };

  return (
    <div className="flex flex-col min-h-screen">
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
              {sortOrder === "desc" ? "최신순" : "오래된순"}
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading && lpList.length === 0 ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message="LP 목록을 불러올 수 없습니다" />
        ) : lpList.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400 text-center">표시할 LP가 없습니다</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Top loading skeletons (shown when isLoading is true) */}
              {isLoading && lpList.length === 0 && (
                <>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonCard key={`skeleton-top-${i}`} />
                  ))}
                </>
              )}

              {/* Actual LP cards */}
              {lpList.map((lp: Lp) => (
                <div
                  key={lp.id}
                  className="group relative cursor-pointer"
                  onClick={() => navigate(`/lp/${lp.id}`)}
                >
                  {/* 정사각형 카드 - Hover 시 확장 */}
                  <div className="aspect-square relative overflow-hidden rounded-md bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-pink-500/50">
                    {/* 썸네일 배경 이미지 */}
                    {!failedImages.has(lp.id) && lp.thumbnail ? (
                      <img
                        src={lp.thumbnail}
                        alt={lp.title}
                        onError={() => handleImageError(lp.id)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : null}

                    {/* 앨범 아트 아이콘 (이미지 없을 때 or 로딩 실패 시) */}
                    <div className={`absolute inset-0 flex items-center justify-center ${!failedImages.has(lp.id) && lp.thumbnail ? 'bg-black/40' : 'bg-gradient-to-br from-gray-700 to-gray-900'}`}>
                      {/* <span className="text-gray-400 text-6xl group-hover:text-gray-300 transition-colors duration-300"></span> */}
                    </div>

                    {/* 기본 상태: 제목만 표시 (카드 하단) */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 group-hover:opacity-0">
                      <h2 className="text-sm font-semibold text-white line-clamp-2">
                        {lp.title}
                      </h2>
                    </div>

                    {/* Hover 상태: 검정 오버레이 (아래쪽만) + 메타 정보 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                      <div className="flex flex-col gap-3 w-full">
                        {/* 제목 */}
                        <h3 className="text-sm font-bold text-white line-clamp-2">
                          {lp.title}
                        </h3>

                        {/* 구분선 */}
                        <div className="w-8 h-0.5 bg-pink-500"></div>

                        {/* 업로드 날짜 & 좋아요 수 - 가로 정렬 */}
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <span className="text-xs text-gray-300">{formatDate(lp.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">🤍</span>
                            <span className="text-xs text-white font-semibold">{lp.likes?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom loading skeletons (shown when isFetchingNextPage is true) */}
              {isFetchingNextPage && (
                <>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonCard key={`skeleton-bottom-${i}`} />
                  ))}
                </>
              )}
            </div>

            {/* Infinite scroll trigger element */}
            <div ref={observerTarget} className="h-10 mt-8" />
          </>
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
