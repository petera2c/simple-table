import React, { useState, useEffect } from "react";
import HeaderObject from "../../types/HeaderObject";
import {
  FilterCondition,
  StringFilterOperator,
  getAvailableOperators,
  requiresSingleValue,
  requiresNoValue,
} from "../../types/FilterTypes";
import FilterContainer from "./shared/FilterContainer";
import OperatorSelector from "./shared/OperatorSelector";
import FilterInput from "./shared/FilterInput";
import FilterSection from "./shared/FilterSection";
import FilterActions from "./shared/FilterActions";

interface StringFilterProps<T> {
  header: HeaderObject<T>;
  currentFilter?: FilterCondition<T>;
  onApplyFilter: (filter: FilterCondition<T>) => void;
  onClearFilter: () => void;
}

const StringFilter = <T,>({
  header,
  currentFilter,
  onApplyFilter,
  onClearFilter,
}: StringFilterProps<T>) => {
  const [selectedOperator, setSelectedOperator] = useState<StringFilterOperator>(
    (currentFilter?.operator as StringFilterOperator) || "contains"
  );
  const [filterValue, setFilterValue] = useState<string>(String(currentFilter?.value || ""));

  const availableOperators = getAvailableOperators("string") as StringFilterOperator[];

  // Reset form when current filter changes
  useEffect(() => {
    if (currentFilter) {
      setSelectedOperator(currentFilter.operator as StringFilterOperator);
      setFilterValue(String(currentFilter.value || ""));
    } else {
      setSelectedOperator("contains");
      setFilterValue("");
    }
  }, [currentFilter]);

  const handleApplyFilter = () => {
    const filter: FilterCondition<T> = {
      accessor: header.accessor,
      operator: selectedOperator,
      ...(requiresSingleValue(selectedOperator) && { value: filterValue }),
    };

    onApplyFilter(filter);
  };

  const canApply = requiresNoValue(selectedOperator) || filterValue.trim();

  return (
    <FilterContainer>
      <OperatorSelector
        value={selectedOperator}
        onChange={setSelectedOperator}
        operators={availableOperators}
      />

      {requiresSingleValue(selectedOperator) && (
        <FilterSection>
          <FilterInput
            type="text"
            value={filterValue}
            onChange={setFilterValue}
            placeholder="Filter..."
            autoFocus
            onEnterPress={handleApplyFilter}
          />
        </FilterSection>
      )}

      <FilterActions
        onApply={handleApplyFilter}
        onClear={onClearFilter}
        canApply={!!canApply}
        showClear={!!currentFilter}
      />
    </FilterContainer>
  );
};

export default StringFilter;
