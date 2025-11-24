import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp.ts";

interface LpCardProps {
  lp: Lp;
}

export const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lps/${lp.id}`)}
      className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-lg font-bold text-white truncate">
          {lp.title}
        </h3>
      </div>
    </div>
  );
};