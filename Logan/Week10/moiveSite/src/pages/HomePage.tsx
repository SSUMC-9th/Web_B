import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import type { MovieFilters, MovieResponse } from "../types/movie";
import MovieList from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });

  const { data, error, isLoading } = useFetch<MovieResponse>("/search/movie", {
    params: {
      query: "어벤져스",
      include_adult: false,
      language: "ko-KR",
    } as MovieFilters, // 타입 지정
  });

  if (error) {
    return <div>{error}</div>;
  }
  //console.log(data);

  return (
    <div className="container">
      <MovieFilter onChange={setFilters} />
      {isLoading ? (
        <div>로딩중입니다...</div>
      ) : (
        <MovieList movies={data?.results || []} />
      )}
    </div>
  );
}
