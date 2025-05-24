import React from "react";

interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  autoFocus?: boolean;
  className?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  autoFocus = false,
  className = "",
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
      className={`st-filter-select ${className}`.trim()}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FilterSelect;
