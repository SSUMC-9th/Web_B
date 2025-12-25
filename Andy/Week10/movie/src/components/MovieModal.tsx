import { useEffect, useState } from "react";
import type { Movie } from "../types/movie.ts";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const OVERVIEW_LIMIT = 300;
  const hasLongOverview = movie.overview && movie.overview.length > OVERVIEW_LIMIT;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const displayedOverview = isExpanded 
    ? movie.overview 
    : (movie.overview ? movie.overview.slice(0, OVERVIEW_LIMIT) + (hasLongOverview ? "..." : "") : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-bg-elevated rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] md:h-[80vh] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden animate-fadeIn border border-border-color">
        {/* Close Button (Top Right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/5 shrink-0 bg-bg-secondary relative">
          <div className="aspect-[2/3] md:h-full md:aspect-auto">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/500x750?text=No+Image";
              }}
            />
            {/* Gradient Overlay for Mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-transparent to-transparent md:hidden opacity-80" />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col p-6 md:p-8 md:overflow-y-auto bg-bg-elevated">
          <div className="space-y-1 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white">{movie.title}</h2>
            {movie.original_title !== movie.title && (
              <p className="text-sm text-text-tertiary">{movie.original_title}</p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-6">
             {movie.release_date && (
              <span className="flex items-center gap-1.5 bg-bg-tertiary px-2.5 py-1.5 rounded-md font-medium">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                   <line x1="16" y1="2" x2="16" y2="6" />
                   <line x1="8" y1="2" x2="8" y2="6" />
                   <line x1="3" y1="10" x2="21" y2="10" />
                 </svg>
                 {movie.release_date}
              </span>
             )}
             <span className="flex items-center gap-1.5 text-primary-pink bg-primary-pink/10 px-2.5 py-1.5 rounded-md font-bold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {movie.vote_average.toFixed(1)} <span className="text-text-quaternary font-normal">({movie.vote_count})</span>
             </span>
             {movie.adult && (
                <span className="px-2.5 py-1.5 rounded-md bg-red-600/20 text-red-500 font-bold text-xs border border-red-600/30">19+</span>
             )}
          </div>

          <div className="space-y-3 mb-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              줄거리
            </h3>
            <div className="relative">
              <p className="text-text-secondary leading-relaxed text-base whitespace-pre-line">
                {displayedOverview || "이 영화에 대한 줄거리 정보가 아직 등록되지 않았습니다."}
              </p>
              {hasLongOverview && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-primary-pink hover:text-primary-pink-light font-semibold text-sm transition-colors"
                >
                  {isExpanded ? "간략히 보기" : "더 보기"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t border-bg-tertiary">
            <a
              href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#f5c518] hover:bg-[#e2b616] text-black font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl"
            >
              <span className="font-extrabold">IMDb</span>
              <span>에서 검색하기</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            
            <button
              onClick={onClose}
              className="flex-1 bg-bg-tertiary hover:bg-bg-elevated border border-border-color hover:border-text-tertiary text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
