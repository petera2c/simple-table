import React, { useState, useEffect, useMemo } from "react";
import HeaderObject from "../../types/HeaderObject";
import { FilterCondition, EnumFilterOperator } from "../../types/FilterTypes";
import FilterContainer from "./shared/FilterContainer";
import FilterSection from "./shared/FilterSection";
import FilterActions from "./shared/FilterActions";
import Checkbox from "../Checkbox";

interface EnumFilterProps {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
}

const EnumFilter: React.FC<EnumFilterProps> = ({
  header,
  currentFilter,
  onApplyFilter,
  onClearFilter,
}) => {
  const enumOptions = useMemo(() => header.enumOptions || [], [header.enumOptions]);

  // Default to all options selected if no current filter
  const [selectedValues, setSelectedValues] = useState<string[]>(
    currentFilter?.values || enumOptions
  );

  // Always use "in" operator for enum filters since it's the most logical
  const selectedOperator: EnumFilterOperator = "in";

  // Reset form when current filter changes
  useEffect(() => {
    if (currentFilter) {
      setSelectedValues(currentFilter.values || []);
    } else {
      // If no filter, default to all options selected
      setSelectedValues(enumOptions);
    }
  }, [currentFilter, enumOptions]);

  const handleValueToggle = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSelectAllToggle = (checked: boolean) => {
    if (checked) {
      setSelectedValues(enumOptions);
    } else {
      setSelectedValues([]);
    }
  };

  const handleApplyFilter = () => {
    // If all values are selected, clear the filter instead of applying it
    // because selecting all values is equivalent to no filter
    if (selectedValues.length === enumOptions.length) {
      onClearFilter();
      return;
    }

    const filter: FilterCondition = {
      accessor: header.accessor,
      operator: selectedOperator,
      values: selectedValues,
    };

    onApplyFilter(filter);
  };

  const canApply = () => {
    // Can't apply if no values are selected
    if (selectedValues.length === 0) return false;

    // Can't apply if all values are selected (equivalent to no filter)
    if (selectedValues.length === enumOptions.length) return false;

    // Can apply if some but not all values are selected
    return true;
  };

  // Check if all options are selected
  const isAllSelected = selectedValues.length === enumOptions.length;
  // Check if some but not all options are selected (for indeterminate state)

  return (
    <FilterContainer>
      <FilterSection>
        <div className="st-enum-filter-options">
          {/* Select All checkbox */}
          <div className="st-enum-select-all">
            <Checkbox checked={isAllSelected} onChange={handleSelectAllToggle}>
              <span className="st-enum-option-label st-enum-select-all-label">Select All</span>
            </Checkbox>
          </div>

          {/* Individual option checkboxes */}
          {enumOptions.map((option) => (
            <Checkbox
              key={option}
              checked={selectedValues.includes(option)}
              onChange={() => handleValueToggle(option)}
            >
              <span className="st-enum-option-label">{option}</span>
            </Checkbox>
          ))}
        </div>
      </FilterSection>

      <FilterActions
        onApply={handleApplyFilter}
        onClear={onClearFilter}
        canApply={canApply()}
        showClear={!!currentFilter}
      />
    </FilterContainer>
  );
};

export default EnumFilter;
