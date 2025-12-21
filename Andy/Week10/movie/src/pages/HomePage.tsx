import { useState, useEffect, useRef, useCallback } from "react";
import { axiosClient } from "../apis/axiosClient.ts";
import type { MovieFilters, MovieResponse, Movie } from "../types/movie.ts";
import MovieList from "../components/MovieList.tsx";
import MovieFilter from "../components/MovieFilter.tsx";
import MovieModal from "../components/MovieModal.tsx";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "하츄핑",
    include_adult: false,
    language: "ko-KR",
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchMovies = useCallback(async (pageToFetch: number, currentFilters: MovieFilters) => {
    if (!currentFilters.query) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get<MovieResponse>("/search/movie", {
        params: {
          query: currentFilters.query,
          include_adult: currentFilters.include_adult,
          language: currentFilters.language,
          page: pageToFetch,
        },
      });

      const data = response.data;

      if (pageToFetch === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }

      setHasMore(data.page < data.total_pages);
      setTotalResults(data.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filters.query) {
      setPage(1);
      fetchMovies(1, filters);
    }
  }, [filters, fetchMovies]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page, filters);
    }
  }, [page, filters, fetchMovies]);

  const handleSearch = (newFilters: MovieFilters) => {
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
      setMovies([]);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen">
      <MovieFilter onSearch={handleSearch} />

      {isLoading && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-16 border-4 border-bg-tertiary border-t-primary-pink rounded-full animate-spin"></div>
          <p className="text-text-tertiary text-lg">영화를 검색 중입니다...</p>
        </div>
      )}

      {error && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-4 px-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary-pink" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
          </svg>
          <p className="text-text-tertiary text-lg">에러가 발생했습니다: {error}</p>
        </div>
      )}

      {filters.query && !error && (
        <>
          {movies.length > 0 ? (
            <>
              <div className="px-4 md:px-8 lg:px-12 mb-6">
                <h2 className="text-xl md:text-2xl font-semibold">
                  <span className="text-text-primary">"{filters.query}"</span>
                  <span className="text-text-tertiary ml-2">검색 결과</span>
                  <span className="text-primary-pink ml-2">{totalResults}개</span>
                </h2>
              </div>
              <MovieList movies={movies} onMovieClick={handleMovieClick} />

              <div ref={lastMovieElementRef} className="h-20 flex justify-center items-center">
                 {isLoading && page > 1 && (
                     <div className="w-8 h-8 border-4 border-bg-tertiary border-t-primary-pink rounded-full animate-spin"></div>
                 )}
              </div>
            </>
          ) : (
            !isLoading && (
              <div className="flex flex-col items-center justify-center py-32 gap-4 px-4">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-text-tertiary" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  <line x1="11" y1="8" x2="11" y2="14" strokeLinecap="round" />
                  <line x1="8" y1="11" x2="14" y2="11" strokeLinecap="round" />
                </svg>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary">검색 결과가 없습니다</h2>
                <p className="text-text-tertiary">다른 키워드로 검색해보세요.</p>
              </div>
            )
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
