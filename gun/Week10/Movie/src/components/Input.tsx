import { memo, forwardRef } from "react";

interface InputProps {
  // value와 onChange는 이제 필수가 아닐 수 있으므로 ?를 붙여 유연하게 만듭니다.
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// forwardRef로 감싸서 외부에서 ref를 주입받을 수 있게 합니다.
export const Input = memo(forwardRef<HTMLInputElement, InputProps>(({
  value,
  onChange,
  placeholder = "검색어를 입력하세요.",
  className,
}, ref) => {
  return (
    <div className="relative w-full group">
      <input
        ref={ref} // 전달받은 ref를 여기에 연결!
        className={`
          w-full bg-[#2c2c2c] text-white rounded-xl border-none p-4 pl-12 shadow-inner
          placeholder-gray-500 outline-none transition-all duration-300
          ring-1 ring-gray-700 focus:ring-2 focus:ring-cyan-500 focus:bg-[#333333]
          group-hover:ring-gray-600 ${className}
        `}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {/* 돋보기 아이콘 */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}));