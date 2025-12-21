interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder = "영화 제목을 입력하세요..." }: SearchInputProps) => {
  return (
    <div className="relative w-full">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18.5 18.5l-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3 px-4 pl-11 bg-bg-secondary border border-border-color rounded-lg text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-primary-pink focus:shadow-custom"
      />
    </div>
  );
};

export default SearchInput;
