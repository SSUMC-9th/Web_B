import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner.tsx";
import { useMovieDetails } from "../hooks/useMovieDetails";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { movie, credits, loading, error } = useMovieDetails(Number(id));

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">{error}</div>;
  if (!movie) return <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl">영화 정보가 없습니다.</div>;

  const directors = credits?.crew.filter(person => person.job === "Director") || [];
  const topCast = credits?.cast.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 배경 이미지 */}
      <div className="relative w-full h-[500px]">
        {movie.backdrop_path && (
          <>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </>
        )}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 포스터 */}
          <div className="flex-shrink-0">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-64 rounded-lg shadow-2xl"
              />
            )}
          </div>

          {/* 영화 정보 */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>

            {/* 평점 및 기본 정보 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-2xl">⭐</span>
                <span className="text-2xl font-semibold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">({movie.vote_count.toLocaleString()})</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">{movie.release_date}</span>
              {movie.runtime && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-300">{movie.runtime}분</span>
                </>
              )}
            </div>

            {/* 장르 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="px-4 py-2 bg-red-600 rounded-full text-sm font-medium">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* 줄거리 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">줄거리</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* 감독 */}
            {directors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">감독</h3>
                <div className="flex flex-wrap gap-2">
                  {directors.map(director => (
                    <span key={director.id} className="text-gray-300">{director.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 출연진 */}
        {topCast.length > 0 && (
          <div className="mt-12 mb-12">
            <h2 className="text-3xl font-bold mb-6">출연진</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {topCast.map(actor => (
                <div key={actor.id} className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-3 rounded-full overflow-hidden bg-gray-800">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
                        👤
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-center">{actor.name}</p>
                  <p className="text-sm text-gray-400 text-center">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}