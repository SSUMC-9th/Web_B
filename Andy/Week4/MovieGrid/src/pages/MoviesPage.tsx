import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import Button from "../components/Button";
import type { Movie } from "../types/movie.ts";
import { useCustomFetch } from "../hooks/useCustomFetch";


export default function MoviesPage() {
  const [page, setPage] = useState(1);
  const params = useParams<{
    category: string
  }>();

  const { movies, isPending, error } = useCustomFetch(params.category!, page);

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