import { type Movie } from "../types/movie";

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    // 모달 배경 클릭 시 닫기
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // IMDb 검색 열기
    const handleImdbSearch = () => {
        const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
        window.open(searchUrl, '_blank');
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* 포스터 이미지 */}
                <div className="relative">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-96 object-cover rounded-t-lg"
                    />
                    {/* 닫기 버튼 (X) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-all"
                    >
                        ×
                    </button>
                </div>

                {/* 영화 정보 */}
                <div className="p-6 space-y-4">
                    {/* 제목 */}
                    <h2 className="text-3xl font-bold text-white">{movie.title}</h2>

                    {/* 원제 */}
                    {movie.original_title !== movie.title && (
                        <p className="text-gray-400 text-sm italic">{movie.original_title}</p>
                    )}

                    {/* 평점 및 개봉일 */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                            <span className="text-gray-400">/ 10</span>
                        </div>
                        <span className="text-gray-400">|</span>
                        <div className="text-gray-300">
                            개봉일: {movie.release_date}
                        </div>
                    </div>

                    {/* 인기도 */}
                    <div className="text-sm text-gray-300">
                        인기도: {movie.popularity.toFixed(0)}
                    </div>

                    {/* 줄거리 */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">줄거리</h3>
                        <p className="text-gray-300 leading-relaxed">
                            {movie.overview || "줄거리 정보가 없습니다."}
                        </p>
                    </div>

                    {/* 언어 */}
                    <div className="text-sm text-gray-300">
                        언어: <span className="uppercase">{movie.original_language}</span>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex gap-3 pt-4">
                        {/* IMDb 검색 버튼 */}
                        <button
                            onClick={handleImdbSearch}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            IMDb에서 검색하기
                        </button>

                        {/* 닫기 버튼 */}
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
