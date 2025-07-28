import { useState, useEffect } from "react";
import HeaderObject from "../../types/HeaderObject";
import {
  FilterCondition,
  BooleanFilterOperator,
  getAvailableOperators,
  requiresSingleValue,
  requiresNoValue,
} from "../../types/FilterTypes";
import FilterContainer from "./shared/FilterContainer";
import OperatorSelector from "./shared/OperatorSelector";
import FilterSelect from "./shared/FilterSelect";
import FilterSection from "./shared/FilterSection";
import FilterActions from "./shared/FilterActions";

interface BooleanFilterProps<T> {
  header: HeaderObject<T>;
  currentFilter?: FilterCondition<T>;
  onApplyFilter: (filter: FilterCondition<T>) => void;
  onClearFilter: () => void;
}

const BooleanFilter = <T,>({
  header,
  currentFilter,
  onApplyFilter,
  onClearFilter,
}: BooleanFilterProps<T>) => {
  const [selectedOperator, setSelectedOperator] = useState<BooleanFilterOperator>(
    (currentFilter?.operator as BooleanFilterOperator) || "equals"
  );
  const [filterValue, setFilterValue] = useState<string>(
    currentFilter?.value !== undefined ? String(currentFilter.value) : "true"
  );

  const availableOperators = getAvailableOperators("boolean") as BooleanFilterOperator[];

  // Reset form when current filter changes
  useEffect(() => {
    if (currentFilter) {
      setSelectedOperator(currentFilter.operator as BooleanFilterOperator);
      setFilterValue(currentFilter.value !== undefined ? String(currentFilter.value) : "true");
    } else {
      setSelectedOperator("equals");
      setFilterValue("true");
    }
  }, [currentFilter]);

  const handleApplyFilter = () => {
    if (!header.accessor) return;
    const filter: FilterCondition<T> = {
      accessor: header.accessor,
      operator: selectedOperator,
    };

    if (requiresSingleValue(selectedOperator)) {
      filter.value = filterValue === "true";
    }

    onApplyFilter(filter);
  };

  const canApply = requiresNoValue(selectedOperator) || filterValue !== "";

  const booleanOptions = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
  ];

  return (
    <FilterContainer>
      <OperatorSelector
        value={selectedOperator}
        onChange={setSelectedOperator}
        operators={availableOperators}
      />

      {requiresSingleValue(selectedOperator) && (
        <FilterSection>
          <FilterSelect value={filterValue} onChange={setFilterValue} options={booleanOptions} />
        </FilterSection>
      )}

      <FilterActions
        onApply={handleApplyFilter}
        onClear={onClearFilter}
        canApply={canApply}
        showClear={!!currentFilter}
      />
    </FilterContainer>
  );
};

export default BooleanFilter;
