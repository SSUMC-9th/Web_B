import type { MovieCast } from "../types/movie";
import defaultProfile from "../assets/default_image.jpeg"; // 기본 이미지 import

interface MovieCastProps {
  movie_c: MovieCast;
}

export default function Credit({ movie_c }: MovieCastProps) {
  const profileImg = movie_c.profile_path
    ? `http://image.tmdb.org/t/p/w200${movie_c.profile_path}`
    : defaultProfile;

  
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <img
        src={profileImg}
        alt={`${movie_c.name} 프로필 이미지`}
        className="w-32 h-32 object-cover rounded-full shadow-md
                    transition-transform duration-200 hover:scale-120"
      />
      <p className="font-semibold">{movie_c.name}</p>
      <p className="text-sm text-gray-400">{movie_c.character}</p>

    </div>
  );
}