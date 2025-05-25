import React, { useState, useEffect } from "react";
import HeaderObject from "../../types/HeaderObject";
import {
  FilterCondition,
  DateFilterOperator,
  getAvailableOperators,
  requiresSingleValue,
  requiresMultipleValues,
  requiresNoValue,
} from "../../types/FilterTypes";
import FilterContainer from "./shared/FilterContainer";
import OperatorSelector from "./shared/OperatorSelector";
import FilterInput from "./shared/FilterInput";
import FilterSection from "./shared/FilterSection";
import FilterActions from "./shared/FilterActions";

interface DateFilterProps {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  header,
  currentFilter,
  onApplyFilter,
  onClearFilter,
}) => {
  const [selectedOperator, setSelectedOperator] = useState<DateFilterOperator>(
    (currentFilter?.operator as DateFilterOperator) || "equals"
  );
  const [filterValue, setFilterValue] = useState<string>(currentFilter?.value || "");
  const [filterValueFrom, setFilterValueFrom] = useState<string>(currentFilter?.values?.[0] || "");
  const [filterValueTo, setFilterValueTo] = useState<string>(currentFilter?.values?.[1] || "");

  const availableOperators = getAvailableOperators("date") as DateFilterOperator[];

  // Reset form when current filter changes
  useEffect(() => {
    if (currentFilter) {
      setSelectedOperator(currentFilter.operator as DateFilterOperator);
      setFilterValue(currentFilter.value || "");
      setFilterValueFrom(currentFilter.values?.[0] || "");
      setFilterValueTo(currentFilter.values?.[1] || "");
    } else {
      setSelectedOperator("equals");
      setFilterValue("");
      setFilterValueFrom("");
      setFilterValueTo("");
    }
  }, [currentFilter]);

  const handleApplyFilter = () => {
    const filter: FilterCondition = {
      accessor: header.accessor,
      operator: selectedOperator,
    };

    if (requiresSingleValue(selectedOperator)) {
      filter.value = filterValue;
    } else if (requiresMultipleValues(selectedOperator)) {
      filter.values = [filterValueFrom, filterValueTo];
    }

    onApplyFilter(filter);
  };

  const canApply = () => {
    if (requiresNoValue(selectedOperator)) return true;
    if (requiresSingleValue(selectedOperator)) return filterValue.trim() !== "";
    if (requiresMultipleValues(selectedOperator)) {
      return filterValueFrom.trim() !== "" && filterValueTo.trim() !== "";
    }
    return false;
  };

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
            type="date"
            value={filterValue}
            onChange={setFilterValue}
            placeholder="Select date..."
            autoFocus
          />
        </FilterSection>
      )}

      {requiresMultipleValues(selectedOperator) && (
        <FilterSection>
          <FilterInput
            type="date"
            value={filterValueFrom}
            onChange={setFilterValueFrom}
            placeholder="From date..."
            autoFocus
            className="st-filter-input-range-from"
          />
          <FilterInput
            type="date"
            value={filterValueTo}
            onChange={setFilterValueTo}
            placeholder="To date..."
          />
        </FilterSection>
      )}

      <FilterActions
        onApply={handleApplyFilter}
        onClear={onClearFilter}
        canApply={canApply()}
        showClear={!!currentFilter}
      />
    </FilterContainer>
  );
};

export default DateFilter;
