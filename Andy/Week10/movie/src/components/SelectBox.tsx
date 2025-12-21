interface SelectOption {
  value: string;
  label: string;
}

interface SelectBoxProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

const SelectBox = ({ id, label, icon, value, options, onChange }: SelectBoxProps) => {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="flex items-center gap-2 text-sm text-text-secondary font-medium whitespace-nowrap">
        {icon && <span className="text-primary-pink">{icon}</span>}
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="py-2 px-3 bg-bg-secondary border border-border-color rounded-lg text-text-primary text-sm outline-none cursor-pointer transition-all duration-200 hover:border-primary-pink focus:border-primary-pink focus:shadow-custom"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-bg-secondary text-text-primary">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
