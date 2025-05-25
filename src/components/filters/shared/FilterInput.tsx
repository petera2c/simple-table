import React from "react";

interface FilterInputProps {
  type?: "text" | "number" | "date";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  autoFocus = false,
  className = "",
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`st-filter-input ${className}`.trim()}
    />
  );
};

export default FilterInput;
