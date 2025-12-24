import React, { memo, useState } from "react";
import type { MovieFilters, MovieLanguage } from "../types/movie";
import { Input } from "./Input";
import { SelectBox } from "./SelectBox";
import { LANGUAGE_OPTIONS } from "../constants/movie";
import { LanguageSelector } from "./LanguageSelector";

interface MovieFilterProps {
  onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
  console.log("moviefilter리렌더링");
  const [query, setQuery] = useState<string>("");
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState<MovieLanguage>("ko-KR");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // movieFilter가 들고 있는 3개의 상태를 하나의 객체로 묶어서
    // 부모 컴포넌트에게 전달하는 함수

    const filters: MovieFilters = {
      query,
      include_adult: includeAdult,
      language,
    };
    console.log(filters);

    // 전달값의 함수
    onChange(filters);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="transform space-y-6 rounded-2xl border-gray-300 bg-white
    p-6 shadow-xl transition-all hover:shadow-2xl"
      >
        <div className="flex flex-wrap gap-6">
          <div className="min-w-[450px] flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              영화제목
            </label>
            <Input value={query} onChange={setQuery} />
          </div>

          <div className="min-w-[250px] flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              옵션
            </label>
            <SelectBox
              checked={includeAdult}
              onChange={setIncludeAdult}
              label="성인 콘텐츠 표시"
              id="include_adult" // 컴포넌트에서 쓰려고
              className="w-full rounded-lg border border-gray-300 px-4 py-2
            shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="min-w-[250px] flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              언어
            </label>
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              options={LANGUAGE_OPTIONS}
              className="w-full rounded-lg border border-gray-300 px-4 py-2
          shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <button type="submit">영화검색</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default memo(MovieFilter);
