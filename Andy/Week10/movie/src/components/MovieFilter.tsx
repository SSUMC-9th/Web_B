import { useState } from "react";
import type { MovieFilters, MovieLanguage } from "../types/movie.ts";
import SearchInput from "./SearchInput.tsx";
import FilterOptions from "./FilterOptions.tsx";

interface MovieFilterProps {
  onSearch: (filters: MovieFilters) => void;
}

const MovieFilter = ({ onSearch }: MovieFilterProps) => {
  const [query, setQuery] = useState<string>("");
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState<MovieLanguage>("ko-KR");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: MovieFilters = {
      query,
      include_adult: includeAdult,
      language,
    };
    if (query.trim()) {
      onSearch(filters);
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-10 text-center">
        <span className="text-gradient">영화 검색</span>
      </h1>

      <FilterOptions
        language={language}
        includeAdult={includeAdult}
        onLanguageChange={setLanguage}
        onAdultChange={setIncludeAdult}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="영화 제목을 입력하세요..."
          />
        </div>
        <button
          type="submit"
          className="py-3 px-8 bg-primary-pink hover:bg-primary-pink-hover active:bg-primary-pink-dark text-white font-semibold rounded-lg transition-all duration-200 whitespace-nowrap hover:shadow-custom-hover"
        >
          검색
        </button>
      </form>
    </div>
  );
};

export default MovieFilter;
