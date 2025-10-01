import type { Movie } from "../types/movie.ts";
import { useState } from "react";
import {useNavigate, useParams} from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const params = useParams<{ category: string }>();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="mt-2 rounded-lg shadow-md w-full"
      />

      {isHovered && (
        <div className="absolute top-2 left-0 right-0 bottom-0 text-white p-4 rounded-lg flex flex-col justify-center backdrop-blur-sm bg-black/75">
          <h3 className="text-2xl font-bold mt-2">{movie.title}</h3>
          <p className="text-sm mt-1 line-clamp-7">{movie.overview}</p>
        </div>
      )}
    </div>
  )
}