import { useNavigate } from "react-router-dom"; // 1. useNavigate 추가
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate(); // 2. navigate 함수 생성
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "https://placehold.co/500x750?text=No+Poster";

  // 3. 클릭 핸들러: 상세 페이지 경로(/movie/ID)로 이동
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div 
      onClick={handleCardClick} // 4. 클릭 이벤트 연결
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#1c1c1c] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.8)]"
    >
      {/* 이미지 섹션 */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage}
          alt={`${movie.title} 포스터`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-yellow-400 backdrop-blur-md">
          <span>★</span>
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* 텍스트 정보 섹션 */}
      <div className="p-4">
        <h3 className="mb-1 truncate text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>{movie.release_date?.split("-")[0]}</span>
          <span className="h-1 w-1 rounded-full bg-gray-600" />
          <span className="uppercase">{movie.original_language}</span>
          {movie.adult && (
            <span className="rounded bg-red-600/20 px-1 text-[10px] text-red-500 ring-1 ring-red-500/50">
              19+
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-400 group-hover:text-gray-300">
          {movie.overview || "상세 정보가 준비되지 않았습니다."}
        </p>
      </div>

      <div className="absolute bottom-0 h-1 w-full scale-x-0 bg-cyan-500 transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
};

export default MovieCard;