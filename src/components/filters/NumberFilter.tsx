import React, { useState, useEffect } from "react";
import HeaderObject from "../../types/HeaderObject";
import {
  FilterCondition,
  NumberFilterOperator,
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

interface NumberFilterProps<T> {
  header: HeaderObject<T>;
  currentFilter?: FilterCondition<T>;
  onApplyFilter: (filter: FilterCondition<T>) => void;
  onClearFilter: () => void;
}

const NumberFilter = <T,>({
  header,
  currentFilter,
  onApplyFilter,
  onClearFilter,
}: NumberFilterProps<T>) => {
  const [selectedOperator, setSelectedOperator] = useState<NumberFilterOperator>(
    (currentFilter?.operator as NumberFilterOperator) || "equals"
  );
  const [filterValue, setFilterValue] = useState<string>(String(currentFilter?.value || ""));
  const [filterValueFrom, setFilterValueFrom] = useState(String(currentFilter?.values?.[0] || ""));
  const [filterValueTo, setFilterValueTo] = useState<string>(
    String(currentFilter?.values?.[1] || "")
  );

  const availableOperators = getAvailableOperators("number") as NumberFilterOperator[];

  // Reset form when current filter changes
  useEffect(() => {
    if (currentFilter) {
      setSelectedOperator(currentFilter.operator as NumberFilterOperator);
      setFilterValue(String(currentFilter.value || ""));
      setFilterValueFrom(String(currentFilter.values?.[0] || ""));
      setFilterValueTo(String(currentFilter.values?.[1] || ""));
    } else {
      setSelectedOperator("equals");
      setFilterValue("");
      setFilterValueFrom("");
      setFilterValueTo("");
    }
  }, [currentFilter]);

  const handleApplyFilter = () => {
    const filter: FilterCondition<T> = {
      accessor: header.accessor,
      operator: selectedOperator,
    };

    if (requiresSingleValue(selectedOperator)) {
      filter.value = parseFloat(filterValue);
    } else if (requiresMultipleValues(selectedOperator)) {
      filter.values = [
        parseFloat(filterValueFrom.toString()),
        parseFloat(filterValueTo.toString()),
      ];
    }

    onApplyFilter(filter);
  };

  const canApply = () => {
    if (requiresNoValue(selectedOperator)) return true;
    if (requiresSingleValue(selectedOperator)) return filterValue.trim() !== "";
    if (requiresMultipleValues(selectedOperator)) {
      return String(filterValueFrom).trim() !== "" && String(filterValueTo).trim() !== "";
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
            type="number"
            value={filterValue}
            onChange={setFilterValue}
            placeholder="Enter number..."
            autoFocus
            onEnterPress={handleApplyFilter}
          />
        </FilterSection>
      )}

      {requiresMultipleValues(selectedOperator) && (
        <FilterSection>
          <FilterInput
            type="number"
            value={filterValueFrom}
            onChange={setFilterValueFrom}
            placeholder="From..."
            autoFocus
            className="st-filter-input-range-from"
            onEnterPress={handleApplyFilter}
          />
          <FilterInput
            type="number"
            value={filterValueTo}
            onChange={setFilterValueTo}
            placeholder="To..."
            onEnterPress={handleApplyFilter}
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

export default NumberFilter;
