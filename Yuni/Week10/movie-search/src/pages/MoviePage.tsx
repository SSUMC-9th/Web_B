import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import type { MovieResponse } from "../types/movie.ts";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    //1. 로딩상태
    const [isPending, setIsPending] = useState(false);
    //2. 에러상태
    const [error, setError] = useState(false);
    //3. 페이지
    const [page, setPage] = useState(1);

    // 검색 관련 상태
    const [searchQuery, setSearchQuery] = useState("");
    const [includeAdult, setIncludeAdult] = useState(false);
    const [language, setLanguage] = useState("ko-KR");

    const { category = "popular" } = useParams<{
        category: string;
    }>();

    // 검색 제출 핸들러
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1); // 검색 시 페이지를 1로 리셋
    };

    useEffect(() : void => {
        const fetchMovies = async () : Promise<void> => {
            setIsPending(true);
            setError(false);

            try {
                let url: string;

                // 검색어가 있으면 검색 API 호출, 없으면 카테고리별 영화 조회
                if (searchQuery.trim()) {
                    url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&include_adult=${includeAdult}&language=${language}&page=${page}`;
                } else {
                    url = `https://api.themoviedb.org/3/movie/${category}?language=${language}&page=${page}`;
                }

                const { data } = await axios.get<MovieResponse>(url, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                });

                // // API 응답 후 필터링
                // const filteredMovies = includeAdult
                //     ? data.results
                //     : data.results.filter(movie => !movie.adult);
                setMovies(data.results);
            } catch {
                setError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovies();
    }, [page, category, searchQuery, includeAdult, language]);

    if (error) {
        return <div className ="text-red-500 text-2xl">에러가 발생했습니다.</div>;
    }

    return (
    <>
        {/* 영화 검색 영역 */}
        <div className="bg-gray-800 p-6 mb-6 rounded-lg shadow-lg">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
                {/* 영화 제목 입력 */}
                <div>
                    <label htmlFor="searchQuery" className="block text-white mb-2 font-semibold">
                        영화 제목
                    </label>
                    <input
                        id="searchQuery"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="영화 제목을 입력하세요"
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* 성인 콘텐츠 포함 체크박스 */}
                <div className="flex items-center gap-2">
                    <input
                        id="includeAdult"
                        type="checkbox"
                        checked={includeAdult}
                        onChange={(e) => setIncludeAdult(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="includeAdult" className="text-white">
                        성인 콘텐츠 포함
                    </label>
                </div>

                {/* 언어 선택 */}
                <div>
                    <label htmlFor="language" className="block text-white mb-2 font-semibold">
                        언어
                    </label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="ko-KR">한국어</option>
                        <option value="en-US">영어</option>
                        <option value="ja-JP">일본어</option>
                    </select>
                </div>

                {/* 검색 버튼 */}
                <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                >
                    검색
                </button>
            </form>
        </div>

        <div className='flex justify-center items-center gap-6 mt-5'>
        <button
            className = "bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
            onClick={() : void => setPage((prev) => prev - 1)}
            disabled={page === 1}
        >{`<`}</button>
        <span>{page}</span>
        <button
            className = "bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
            onClick={() : void => setPage((prev) => prev + 1)}
            disabled={page === 500}
        >{`>`}</button>
        </div>
        
        {isPending && (
            <div className ="flex justify-center items-center mt-20">
            <LoadingSpinner />
            </div>
        )}

        {!isPending && (
            <div
                className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                lg:grid-cols-5 xl:grid-cols-6 p-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
            </div>
        )}
    </>
    )
}