import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import useFetch from "../hooks/useFetch";
import type { MovieFilters, MovieResponse } from "../types/movie";

export default function HomePage() {
  // 필터 상태 관리 (MovieFilter와 API 요청 연결)
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });

  const axiosRequestConfig = useMemo(() => ({
    params: filters,
  }), [filters],);

  // 필터 상태가 변할 때마다 useFetch가 새로운 데이터를 가져옵니다.
  const { data, error, isLoading } = useFetch<MovieResponse>
    ("/search/movie", 
    axiosRequestConfig,   
  );

  const handleFilterChange = useCallback((newFilters: MovieFilters) => {
  setFilters(newFilters);
}, [setFilters]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* 헤더 영역 */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0f0f0f]/80 py-6 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍿</span>
              <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-2xl font-black text-transparent">
                MOVIE SEARCH
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* 필터 섹션 */}
        <section className="mb-12">
          <MovieFilter onChange={handleFilterChange} />
        </section>

        {/* 결과 섹션 */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-200">
              {filters.query ? `'${filters.query}' 검색 결과` : "추천 영화"}
            </h2>
            <span className="text-sm text-gray-500">
              총 {data?.results.length || 0}개의 영화
            </span>
          </div>

          {error ? (
            <div className="flex h-60 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-red-400">
              <p>⚠️ {error}</p>
            </div>
          ) : isLoading ? (
            <div className="flex h-80 flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
              <p className="animate-pulse font-medium text-cyan-500">영화 정보를 불러오고 있어요...</p>
            </div>
          ) : (
            <div className="transition-all duration-500">
              <MovieList movies={data?.results || []} />
            </div>
          )}
        </section>
      </main>

      {/* 푸터 영역 */}
      <footer className="mt-20 border-t border-white/5 py-10 text-center text-gray-600">
        <p>© 2024 MovieSearch. Powered by TMDB API</p>
      </footer>
    </div>
  );
}