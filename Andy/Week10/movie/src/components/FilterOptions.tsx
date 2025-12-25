import type { MovieLanguage } from "../types/movie.ts";
import SelectBox from "./SelectBox.tsx";
import CheckBox from "./CheckBox.tsx";

interface FilterOptionsProps {
  language: MovieLanguage;
  includeAdult: boolean;
  onLanguageChange: (language: MovieLanguage) => void;
  onAdultChange: (includeAdult: boolean) => void;
}

const FilterOptions = ({
  language,
  includeAdult,
  onLanguageChange,
  onAdultChange,
}: FilterOptionsProps) => {
  const languageOptions = [
    { value: "ko-KR", label: "한국어" },
    { value: "en-US", label: "English" },
    { value: "ja-JP", label: "日本語" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6">
      <SelectBox
        id="language-select"
        label="언어"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        }
        value={language}
        options={languageOptions}
        onChange={(value) => onLanguageChange(value as MovieLanguage)}
      />

      <CheckBox
        checked={includeAdult}
        onChange={onAdultChange}
        label="성인 콘텐츠 포함"
      />
    </div>
  );
};

export default FilterOptions;
