import { useState, useEffect } from "react";
import { getMovieInfo, getMovieCredits } from "../api/movie";
import type { MovieResponse, CreditsResponse } from "../types/movie";

export function useMovieDetails(id: number | undefined) {
  const [movie, setMovie] = useState<MovieResponse | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [movieData, creditsData] = await Promise.all([
          getMovieInfo(id),
          getMovieCredits(id)
        ]);
        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        setError("영화 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  return { movie, credits, loading, error };
}
