import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "../types/movie.ts";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import MovieCard from "../components/MovieCard.tsx";
import Button from "../components/Button.tsx";
import { fetchMovies } from "../api/movies.ts";


export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const params = useParams<{
    category: string
  }>();

  useEffect(() => {
    const getMovies = async() => {
      setIsPending(true);
      try {
        const data = await fetchMovies(params.category!, page);
        setMovies(data.results);
      } catch {
        setError(true);
      } finally {
        setIsPending(false);
      }
    }
    getMovies();
  }, [page, params.category]);

  useEffect(() => {
    setPage(1);
  }, [params.category]);

  if (error) {
    return (
      <span className="text-red-500 text-2xl">
        데이터를 불러오는 중에 오류가 발생했습니다.
      </span>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center mt-4">
        <Button onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>이전</Button>
        <span className="text-xl font-bold">페이지: {page}</span>
        <Button onClick={() => setPage((prev) => prev + 1)}>다음</Button>
      </div>
      { isPending && (
        <div className="flex items-center justify-center h-dvh w-screen">
          <LoadingSpinner />
        </div>
      ) }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {movies.map((movie: Movie) => (
        <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
}