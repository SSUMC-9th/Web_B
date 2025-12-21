import type { Movie } from "../types/movie.ts";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div 
      onClick={onClick}
      className="group bg-bg-secondary rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border border-border-color hover:-translate-y-2 hover:shadow-card hover:border-primary-pink"
    >
      <div className="relative w-full pt-[150%] bg-bg-tertiary overflow-hidden">
        {movie.poster_path ? (
          <img
            src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-text-quaternary">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-0 transition-opacity duration-300 flex flex-col justify-end p-4 group-hover:opacity-100">
          <div className="flex items-center gap-1.5 bg-primary-pink text-white py-1.5 px-3 rounded-lg font-semibold text-sm w-fit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1.5 text-text-primary leading-tight overflow-hidden text-ellipsis line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-sm text-primary-pink mb-2 font-semibold">
          {new Date(movie.release_date).getFullYear()}
        </p>
        <p className="text-sm text-text-tertiary leading-relaxed overflow-hidden text-ellipsis line-clamp-3">
          {movie.overview
            ? movie.overview.length > 100
              ? movie.overview.substring(0, 100) + "..."
              : movie.overview
            : "줄거리 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
