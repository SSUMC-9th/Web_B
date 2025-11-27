import { FaShoppingCart } from "react-icons/fa";
// import { useSelector, useAppDispatch } from "../hooks/useCustomRedux.ts";
// import type { ColState } from "../features/col/colSlice.ts";
// import { calculateTotals } from "../features/col/colSlice.ts";
import { useEffect } from "react";
import {useColActions, useColInfo} from "../hooks/useColStore.ts";

const NavBar = () => {
  const { amount } = useColInfo();
  const { calculateTotals } = useColActions();
  // const { amount } = useSelector((state): ColState => state.cart);
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(calculateTotals())
  // }, [dispatch])

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-[#e5e5e7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-[#fa233b]"
            >
              <circle cx="16" cy="16" r="14" fill="currentColor" />
              <path
                d="M16 8v16M12 12l4-4 4 4M12 20l4 4 4-4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">
              Music Library
            </h1>
          </div>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-8">
            {['Browse', 'Library', 'Search', 'Radio'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-normal text-[#1d1d1f] hover:text-[#fa233b] transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Shopping Col */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#f5f5f7] transition-all duration-200">
              <FaShoppingCart className="text-xl text-[#1d1d1f]" />
              <span className="text-sm font-semibold text-[#1d1d1f] tabular-nums">
                {amount}
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#fa233b] rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
