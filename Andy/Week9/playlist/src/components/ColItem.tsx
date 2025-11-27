import type { Lp } from "../types/col.ts";
// import { useAppDispatch } from "../hooks/useCustomRedux.ts";
// import { increaseItem, decreaseItem, removeItem } from "../features/col/colSlice.ts";
import { useColActions } from "../hooks/useColStore.ts";

interface ColItemProps {
  lp: Lp;
}

const ColItem = ({ lp }: ColItemProps) => {
  // const dispatch = useAppDispatch();
  const { increaseItem, decreaseItem, removeItem } = useColActions();

  const handleIncrease = () => {
    // dispatch(increaseItem(lp.id));
    increaseItem(lp.id);
  };

  const handleDecrease = () => {
    if (lp.amount === 1) {
      // dispatch(removeItem(lp.id));
      removeItem(lp.id);
      return;
    }
    // dispatch(decreaseItem(lp.id));
    decreaseItem(lp.id);
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#e5e5e7] overflow-hidden hover:shadow-lg hover:border-[#fa233b]/30 transition-all duration-300">
      <div className="flex items-center p-6">
        {/* Album Cover */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden shadow-sm">
            <img
              src={lp.img}
              alt={lp.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Album Info */}
        <div className="flex-grow ml-5">
          <h3 className="text-xl font-semibold text-[#1d1d1f] mb-0.5">
            {lp.title}
          </h3>
          <p className="text-base text-[#86868b] mb-2">
            {lp.singer}
          </p>
          <p className="text-lg font-semibold text-[#fa233b]">
            ${lp.price.toFixed(2)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 ml-6">
          {/* Decrease Button */}
          <button
            onClick={handleDecrease}
            disabled={lp.amount === 0}
            className="w-10 h-10 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center active:scale-90"
            aria-label="Decrease quantity"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 7H11"
                stroke="#1d1d1f"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Quantity Display */}
          <div className="min-w-[50px] text-center">
            <span className="text-2xl font-semibold text-[#1d1d1f] tabular-nums">
              {lp.amount}
            </span>
          </div>

          {/* Increase Button */}
          <button
            onClick={handleIncrease}
            className="w-10 h-10 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] transition-all duration-200 flex items-center justify-center active:scale-90"
            aria-label="Increase quantity"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M7 3V11M3 7H11"
                stroke="#1d1d1f"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColItem;
