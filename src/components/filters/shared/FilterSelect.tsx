import CustomSelect, { CustomSelectOption } from "./CustomSelect";

interface FilterSelectProps {
  className?: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  value: string;
}

const FilterSelect = ({
  className = "",
  onChange,
  options,
  placeholder,
  value,
}: FilterSelectProps) => {
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
