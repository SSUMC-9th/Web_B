import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosClient } from "../apis/axiosClient";
import type { Movie } from "../types/movie";

// TMDB Movie Detail response might differ slightly (e.g. genres), but for now we can cast or extend.
interface MovieDetail extends Omit<Movie, "genre_ids"> {
  genres: { id: number; name: string }[];
  tagline: string;
  runtime: number;
}

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get<MovieDetail>(`/movie/${id}`, {
            params: {
                language: "ko-KR"
            }
        });
        setMovie(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movie details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovieDetail();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-16 h-16 border-4 border-bg-tertiary border-t-primary-pink rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary gap-4">
         <p className="text-xl">영화를 불러오는데 실패했습니다.</p>
         <button onClick={() => navigate(-1)} className="text-primary-pink hover:underline">뒤로 가기</button>
      </div>
    );
  }

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
  const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-20">
      {/* Backdrop Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
        {movie.backdrop_path ? (
          <>
             <img
              src={`${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
            <span className="text-text-tertiary">이미지가 없습니다</span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end">
            {/* Poster for larger screens */}
            <div className="hidden md:block w-48 lg:w-64 rounded-xl overflow-hidden shadow-2xl border-2 border-text-tertiary/20 flex-shrink-0">
                 {movie.poster_path && (
                    <img 
                        src={`${POSTER_BASE_URL}${movie.poster_path}`} 
                        alt={movie.title}
                        className="w-full h-full object-cover" 
                    />
                 )}
            </div>

            <div className="flex-1 mb-4 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{movie.title}</h1>
                {movie.tagline && <p className="text-xl text-text-secondary italic mb-4">"{movie.tagline}"</p>}
                
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-text-secondary mb-6">
                    {movie.release_date && (
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                    )}
                    <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary"></span>
                    <span>{movie.runtime}분</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary"></span>
                    <div className="flex items-center gap-1 text-primary-pink font-bold">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map(genre => (
                        <span key={genre.id} className="px-3 py-1 rounded-full border border-text-tertiary/30 text-sm backdrop-blur-sm">
                            {genre.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-8 md:mt-12">
          <div className="md:ml-[calc(12rem+2rem)] lg:ml-[calc(16rem+2rem)]">
            <h2 className="text-2xl font-bold mb-4">개요</h2>
            <p className="text-text-secondary leading-relaxed text-lg mb-12">
                {movie.overview || "줄거리 정보가 없습니다."}
            </p>
            
            <button 
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary rounded-lg font-medium transition-colors"
            >
                목록으로 돌아가기
            </button>
          </div>
      </div>
    </div>
  );
}
