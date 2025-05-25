import React, { useState, useEffect, useMemo } from "react";
import HeaderObject from "../../types/HeaderObject";
import { FilterCondition, EnumFilterOperator } from "../../types/FilterTypes";
import FilterContainer from "./shared/FilterContainer";
import FilterSection from "./shared/FilterSection";
import FilterActions from "./shared/FilterActions";

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

  const handleSelectAll = () => {
    setSelectedValues(enumOptions);
  };

  const handleSelectNone = () => {
    setSelectedValues([]);
  };

  const handleApplyFilter = () => {
    const filter: FilterCondition = {
      accessor: header.accessor,
      operator: selectedOperator,
      values: selectedValues,
    };

    onApplyFilter(filter);
  };

  const canApply = () => {
    return selectedValues.length > 0;
  };

  return (
    <FilterContainer>
      <FilterSection>
        <div className="st-enum-filter-controls">
          <button type="button" className="st-enum-filter-control-btn" onClick={handleSelectAll}>
            Select All
          </button>
          <button type="button" className="st-enum-filter-control-btn" onClick={handleSelectNone}>
            Select None
          </button>
        </div>
        <div className="st-enum-filter-options">
          {enumOptions.map((option) => (
            <label key={option} className="st-checkbox-label">
              <input
                type="checkbox"
                className="st-checkbox-input"
                checked={selectedValues.includes(option)}
                onChange={() => handleValueToggle(option)}
              />
              <div
                className={`st-checkbox-custom ${
                  selectedValues.includes(option) ? "st-checked" : ""
                }`}
              >
                {selectedValues.includes(option) && <div className="st-checkbox-checkmark"></div>}
              </div>
              <span className="st-enum-option-label">{option}</span>
            </label>
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
