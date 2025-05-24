import React from "react";
import { FILTER_OPERATOR_LABELS, FilterOperator } from "../../../types/FilterTypes";

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
  return (
    <div className="st-filter-section">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="st-filter-select"
      >
        {operators.map((operator) => (
          <option key={operator} value={operator}>
            {FILTER_OPERATOR_LABELS[operator]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OperatorSelector;
