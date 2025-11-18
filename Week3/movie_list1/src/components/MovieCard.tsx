import { useState } from "react";
import type { Movie } from "../types/movie"

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps)  {
    const [ishover, setishover] = useState(false);
    
    return (
    <div className='relative rounded-xl shadow-lg 
                    overflow-hidden cursor-pointer w-44
                    transition-transform duration-500 hover:scale-105'
        onMouseEnter={(): void => setishover(true)}
        onMouseLeave={(): void => setishover(false)}>

    <img src={`http://image.tmdb.org/t/p/w200${movie.poster_path}`}
         alt={`${movie.title} 영화의 이미지`}
         className=''
    />
    {ishover && (
        <div className='absolute inset-0 
         bg-gradient-to-t from-black/50 
         to-transparent backdrop-blur-md 
         flex flex-col justify-center
         items-center text-white'>
            <h2 className='text-yellow-300 text-lg font-bold text-center leading-snug'>{movie.title}</h2>
            <p className='text-sm text-gray-300 leading-relaxed text-center
                            mt-2 line-clamp-5'>{movie.overview}</p>
        </div>
    )}

    </div>
    )
}