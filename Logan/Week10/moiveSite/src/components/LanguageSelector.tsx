import type { MovieLanguage } from "../types/movie";

export interface LanguageOption {
  // value: string;
  value: MovieLanguage;
  label: string;
}

interface LanguageSelectorProps {
  // value: string;
  value: MovieLanguage;
  onChange: (value: MovieLanguage) => void;
  options: LanguageOption[];
  className?: string;
}

export const LanguageSelector = ({
  value,
  onChange,
  options,
  className = "",
}: LanguageSelectorProps) => {
  return (
    <select
      value={value}
      // onChange={(e) => onChange(e.target.value)}
      onChange={(e) => onChange(e.target.value as MovieLanguage)}
      className={`w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm
        focus:outline-none  focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
