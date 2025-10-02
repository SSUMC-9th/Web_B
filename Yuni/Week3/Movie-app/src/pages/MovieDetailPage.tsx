import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetails, Credits, CastMember, CrewMember } from "../types/movie";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieData = async () => {
            if (!movieId) {
                setError("영화 ID가 없습니다.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // 영화 상세 정보와 크레딧 정보를 동시에 요청
                const [detailsResponse, creditsResponse] = await Promise.all([
                    axios.get<MovieDetails>(
                        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            },
                        }
                    ),
                    axios.get<Credits>(
                        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            },
                        }
                    ),
                ]);

                setMovieDetails(detailsResponse.data);
                setCredits(creditsResponse.data);
            } catch (err) {
                setError("영화 정보를 불러오는데 실패했습니다.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieData();
    }, [movieId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-2xl">{error}</div>
            </div>
        );
    }

    if (!movieDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white text-2xl">영화 정보를 찾을 수 없습니다.</div>
            </div>
        );
    }

    // 감독 찾기
    const directors = credits?.crew.filter((member: CrewMember) => member.job === "Director") || [];

    return (
        <div className="min-h-screen text-white bg-black">
            {/* 백드롭 이미지 배경 */}
            <div
                className="relative w-full h-96 bg-cover bg-center"
                style={{
                    backgroundImage: movieDetails.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`
                        : "none",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </div>

            {/* 메인 콘텐츠 */}
            <div className="container mx-auto px-4 -mt-48 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* 포스터 */}
                    <div className="flex-shrink-0">
                        <img
                            src={
                                movieDetails.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                                    : "/placeholder.png"
                            }
                            alt={movieDetails.title}
                            className="w-64 rounded-lg shadow-2xl"
                        />
                    </div>

                    {/* 영화 정보 */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">{movieDetails.title}</h1>
                        {movieDetails.tagline && (
                            <p className="text-gray-400 italic mb-4">"{movieDetails.tagline}"</p>
                        )}

                        {/* 평점 및 기본 정보 */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center">
                                <span className="text-yellow-400 text-2xl mr-2">★</span>
                                <span className="text-xl font-semibold">
                                    {movieDetails.vote_average.toFixed(1)}
                                </span>
                                <span className="text-gray-400 ml-1">
                                    ({movieDetails.vote_count.toLocaleString()}명)
                                </span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <span>{movieDetails.runtime}분</span>
                            <span className="text-gray-400">|</span>
                            <span>{movieDetails.release_date}</span>
                        </div>

                        {/* 장르 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {movieDetails.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        {/* 줄거리 */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold mb-2">줄거리</h2>
                            <p className="text-gray-300 leading-relaxed">{movieDetails.overview}</p>
                        </div>

                        {/* 감독 */}
                        {directors.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">감독</h3>
                                <div className="flex gap-2">
                                    {directors.map((director) => (
                                        <span key={director.id} className="text-gray-300">
                                            {director.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 추가 정보 */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-400">상태:</span>
                                <span className="ml-2">{movieDetails.status}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">예산:</span>
                                <span className="ml-2">
                                    ${movieDetails.budget.toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-400">수익:</span>
                                <span className="ml-2">
                                    ${movieDetails.revenue.toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-400">언어:</span>
                                <span className="ml-2">{movieDetails.original_language.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 출연진 */}
                {credits && credits.cast.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-6">출연진</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {credits.cast.slice(0, 12).map((actor: CastMember) => (
                                <div key={actor.cast_id} className="text-center">
                                    <div className="mb-2">
                                        {actor.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                alt={actor.name}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                                                <span className="text-4xl text-gray-500">👤</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold text-sm">{actor.name}</p>
                                    <p className="text-gray-400 text-xs">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 제작진 */}
                {credits && credits.crew.length > 0 && (
                    <div className="mt-12 mb-12">
                        <h2 className="text-3xl font-bold mb-6">주요 제작진</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {credits.crew
                                .filter(
                                    (member: CrewMember) =>
                                        member.job === "Director" ||
                                        member.job === "Producer" ||
                                        member.job === "Screenplay" ||
                                        member.job === "Writer"
                                )
                                .slice(0, 12)
                                .map((member: CrewMember) => (
                                    <div key={member.credit_id} className="text-center">
                                        <div className="mb-2">
                                            {member.profile_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                                                    alt={member.name}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                                                    <span className="text-4xl text-gray-500">👤</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-semibold text-sm">{member.name}</p>
                                        <p className="text-gray-400 text-xs">{member.job}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
