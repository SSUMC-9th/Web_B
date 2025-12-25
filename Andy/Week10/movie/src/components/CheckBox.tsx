interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const CheckBox = ({ checked, onChange, label }: CheckBoxProps) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="relative w-5 h-5 bg-bg-secondary border border-border-color rounded transition-all duration-200 peer-checked:bg-primary-pink peer-checked:border-primary-pink group-hover:border-primary-pink flex items-center justify-center">
        <svg
          className={`w-3 h-3 text-white transition-opacity ${
            checked ? "opacity-100" : "opacity-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="text-sm text-text-secondary font-medium">{label}</span>
    </label>
  );
};

export default CheckBox;
