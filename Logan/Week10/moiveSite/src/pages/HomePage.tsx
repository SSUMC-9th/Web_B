import useFetch from "../hooks/useFetch";
import type { Movie, MovieFilters, MovieResponse } from "../types/movie";
import MovieList from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";
import { useCallback, useMemo, useState } from "react";
import MovieDetailModal from "../components/MovieDetailModat";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });

  const axiosRequestConfig = useMemo(
    (): { params: MovieFilters } => ({
      params: filters,
    }),
    [filters]
  );

  // useFetch 정의보면 전달값이 (url, options)임
  // {params: filters} 객체가 그대로 options에 들어간다.
  const { data, error, isLoading } = useFetch<MovieResponse>(
    "/search/movie",
    axiosRequestConfig
  );

  // moviefileter의 리렌더링 방지하려고
  const handleMovieFilters = useCallback((filters: MovieFilters): void => {
    setFilters(filters);
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
  //console.log(data);

  // 모달 기능들
  // ✅ 모달: 선택된 영화 상태 추가
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // ✅ 카드 클릭 시 모달 열기
  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  // ✅ 모달 닫기
  const closeModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className="container">
      <MovieFilter onChange={handleMovieFilters} />

      {isLoading ? (
        <div>로딩중입니다...</div>
      ) : (
        <MovieList
          movies={data?.results || []}
          onMovieClick={handleMovieClick}
        />
      )}

      <MovieDetailModal
        isOpen={!!selectedMovie}
        movie={selectedMovie}
        onClose={closeModal}
      />
    </div>
  );
}
