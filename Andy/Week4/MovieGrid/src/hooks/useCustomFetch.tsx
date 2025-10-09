import { useState, useEffect } from "react";
import {getMovies} from "../api/movies.ts";
import type {Movie} from "../types/movie.ts";

export function useCustomFetch(category: string, page: number) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovies = async() => {
      setIsPending(true);
      try {
        const data = await getMovies(category, page);
        setMovies(data.results);
      } catch {
        setError(true);
      } finally {
        setIsPending(false);
      }
    }
    fetchMovies();
  }, [page, category]);

  return { movies, isPending, error };
}