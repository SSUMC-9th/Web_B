import axios from "axios";
import type { MovieResponse, CreditsResponse } from "../types/movie.ts";

export const getMovieInfo = async (id: number) => {
  const response = await axios.get<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        accept: 'application/json',
      }
    }
  );
  return response.data;
}

export const getMovieCredits = async (id: number) => {
  const response = await axios.get<CreditsResponse>(
    `https://api.themoviedb.org/3/movie/${id}/credits?language=ko-KR`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        accept: 'application/json',
      }
    }
  );
  return response.data;
}