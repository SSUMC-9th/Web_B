import { memo, useRef, useState } from "react";
import type { MovieFilters, MovieLanguage } from "../types/movie";

interface MovieFilterProps {
  onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
  // 이제 글자를 입력해도 이 로그는 찍히지 않습니다.
  console.log("MovieFilter 렌더링 (버튼 클릭이나 언어/옵션 변경시에만 발생)");

  // 1. input 전용 ref 생성 (useState 제거)
  const queryRef = useRef<HTMLInputElement>(null);
  
  // 2. 체크박스와 선택창은 즉각적인 UI 반영이 필요하므로 상태 유지
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState<MovieLanguage>("ko-KR");

  const handleSubmit = (): void => {
    const filters: MovieFilters = {
      // 3. 버튼을 누르는 시점에 ref에서 현재 입력값을 가져옴
      query: queryRef.current?.value || "",
      include_adult: includeAdult,
      language,
    };
    onChange(filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="w-full max-w-4xl mx-auto transform space-y-6 rounded-3xl bg-[#1a1a1a]/80 p-8 backdrop-blur-xl border border-white/5 shadow-2xl transition-all hover:border-white/10">
      <div className="flex flex-col md:flex-row items-end gap-6" onKeyDown={handleKeyDown}>
        <div className="w-full flex-[3]">
          <label className="mb-3 ml-1 block text-sm font-semibold text-gray-400 tracking-wider uppercase">
            영화 제목 검색
          </label>
          {/* 4. Input 컴포넌트 대신 직접 input을 쓰고 ref를 연결하거나, Input 컴포넌트가 ref를 받게 수정해야 함 */}
          <input 
            ref={queryRef}
            placeholder="어떤 영화를 찾으시나요?"
            className="w-full h-[54px] bg-[#2c2c2c] text-white rounded-xl border-none px-4 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-cyan-500 transition-all"
          />
        </div>

        <div className="flex flex-1 gap-4 w-full md:w-auto">
           <div className="flex-1">
              <label className="mb-3 ml-1 block text-sm font-semibold text-gray-400 tracking-wider uppercase">언어</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as MovieLanguage)}
                className="w-full h-[54px] bg-[#2c2c2c] text-white rounded-xl border-none px-4 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer"
              >
                <option value="ko-KR">한국어</option>
                <option value="en-US">English</option>
                <option value="ja-JP">日本語</option>
              </select>
           </div>
        </div>

        <div className="w-full md:w-auto">
          <button 
            onClick={handleSubmit}
            className="w-full md:w-auto h-[54px] px-10 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            검색
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-2 border-t border-white/5">
        <label className="flex cursor-pointer items-center gap-3 group">
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={(e) => setIncludeAdult(e.target.checked)}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-600 bg-[#2c2c2c] transition-all checked:bg-cyan-500"
          />
          <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">성인 콘텐츠 포함</span>
        </label>
      </div>
    </div>
  );
};

export default memo(MovieFilter);