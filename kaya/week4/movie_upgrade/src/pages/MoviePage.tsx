import { useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{ category: string }>();

  // 커스텀 훅 사용
  const { data, isPending, isError, errorMessage, refetch } =
    useCustomFetch<MovieResponse>(
      category ? `/movie/${category}` : null,   // endpoint
      { params: { language: "ko-KR", page } }, // 옵션
      [category, page]                          // 의존성
    );

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 mt-10">
        <p className="text-red-500 text-2xl">에러가 발생했습니다.</p>
        <p className="text-gray-400 text-sm">{errorMessage}</p>
        <button
          className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
          onClick={refetch}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 페이지 네비게이션 */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                     hover:bg-[#b2dab1] transition-all duration-200
                     disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {"<"}
        </button>
        <span>{page} 페이지</span>
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                     hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {">"}
        </button>
      </div>

      {/* 로딩 */}
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {/* 데이터 */}
      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
