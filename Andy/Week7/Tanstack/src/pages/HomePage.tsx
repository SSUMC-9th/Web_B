import { useState, useRef, useEffect } from "react";
import { useGetLpList } from "../hooks/queries/useGetLpList.ts";
import { PAGINATION_ORDER } from "../enums/common.ts";
import { LpCard } from "../components/LpCard/LpCard.tsx";
import { LpCardSkeletonList } from "../components/LpCard/LpCardSkeletonList.tsx";
import { CreateLpModal } from "../components/CreateLpModal.tsx";

const HomePage = () => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpList({
    order,
    limit: 10,
  });

  const handleCreateLp = () => {
    setIsModalOpen(true);
  };

  // 무한 스크롤 Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 모든 페이지의 LP 데이터를 하나의 배열로 합치기
  const allLps = data?.pages.flatMap((page) => page.data.data) || [];

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 영역 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            앨범 찾기
          </h1>

          {/* 정렬 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => setOrder(PAGINATION_ORDER.desc)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                order === PAGINATION_ORDER.desc
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setOrder(PAGINATION_ORDER.asc)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                order === PAGINATION_ORDER.asc
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              오래된순
            </button>
          </div>
        </div>

        {/* 앨범 격자 */}
        {isLoading ? (
          <LpCardSkeletonList />
        ) : isError ? (
          <div className="text-center text-red-400 py-20">
            앨범을 불러오는데 실패했습니다.
          </div>
        ) : allLps.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allLps.map((lp) => (
                <LpCard key={lp.id} lp={lp} />
              ))}
            </div>

            {/* 무한 스크롤 트리거 */}
            <div ref={observerTarget} className="h-10 mt-8">
              {isFetchingNextPage && (
                <div className="text-center text-gray-400">
                  더 불러오는 중...
                </div>
              )}
            </div>

            {!hasNextPage && allLps.length > 0 && (
              <div className="text-center text-gray-400 py-8">
                모든 앨범을 불러왔습니다.
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 py-20">
            아직 등록된 앨범이 없습니다.
          </div>
        )}

        {/* FAB (Floating Action Button) */}
        <button
          onClick={handleCreateLp}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
          aria-label="앨범 추가"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        {/* LP 작성 모달 */}
        <CreateLpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  )
}

export default HomePage;