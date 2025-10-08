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
    
    const { category = "popular" } = useParams<{
        category: string;
    }>();

    useEffect(() : void => {
        const fetchMovies = async () : Promise<void> => {
            try {
                const { data } = await axios.get<MovieResponse>(
                        `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
                    { 
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setMovies(data.results);
            } catch {
                setError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovies();
    }, [page, category]);

    if (error) {
        return <div className ="text-red-500 text-2xl">에러가 발생했습니다.</div>;
    }

    return (
    <>
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