import React from "react";
import CustomSelect, { CustomSelectOption } from "./CustomSelect";

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  className?: string;
  placeholder?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  className = "",
  placeholder,
}) => {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={options}
      className={className}
      placeholder={placeholder}
    />
  );
};

export default FilterSelect;
