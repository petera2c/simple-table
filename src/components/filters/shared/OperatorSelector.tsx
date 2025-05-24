import React from "react";
import { FILTER_OPERATOR_LABELS, FilterOperator } from "../../../types/FilterTypes";
import CustomSelect, { CustomSelectOption } from "./CustomSelect";

interface OperatorSelectorProps<T extends FilterOperator> {
  value: T;
  onChange: (operator: T) => void;
  operators: readonly T[];
}

const OperatorSelector = <T extends FilterOperator>({
  value,
  onChange,
  operators,
}: OperatorSelectorProps<T>) => {
  const options: CustomSelectOption[] = operators.map((operator) => ({
    value: operator,
    label: FILTER_OPERATOR_LABELS[operator],
  }));

  const handleChange = (selectedValue: string) => {
    onChange(selectedValue as T);
  };

  return (
    <div className="st-filter-section">
      <CustomSelect value={value} onChange={handleChange} options={options} />
    </div>
  );
};

export default OperatorSelector;
