import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieInfo } from "../api/movie.ts";
import type { MovieResponse } from "../types/movie.ts";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getMovieInfo(Number(id));
        setMovie(data);
      } catch (err) {
        setError("영화 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <LoadingSpinner />
    </div>
  );
  if (error) return <div>{error}</div>;
  if (!movie) return <div>영화 정보가 없습니다.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>{movie.title}</h1>
      {movie.backdrop_path && (
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
          style={{ width: '100%', maxWidth: '1280px', borderRadius: '8px' }}
        />
      )}
      <div style={{ marginTop: '20px' }}>
        <p><strong>언어:</strong> {movie.original_language}</p>
        <p><strong>장르:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>
        <p><strong>개요:</strong> {movie.overview}</p>
        {movie.homepage && (
          <p><strong>홈페이지:</strong> <a href={movie.homepage} target="_blank" rel="noopener noreferrer">{movie.homepage}</a></p>
        )}
        {movie.imdb_id && (
          <p><strong>ID:</strong> {movie.imdb_id}</p>
        )}
      </div>
    </div>
  );
}