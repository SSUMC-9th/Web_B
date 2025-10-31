import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import useCustomFetch from "../hooks/useCustomFetch.tsx";

export default function MoviePage() {
    const [page, setPage] = useState(1);     //3. 페이지
    
    const { category = "popular" } = useParams<{
        category: string;
    }>();

    const [MovieResponse, isPending, error] = useCustomFetch<{ results: Movie[] }>(
        `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
    );

    const movies = MovieResponse?.results ?? [];

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