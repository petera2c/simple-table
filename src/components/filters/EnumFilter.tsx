import React, { useState, useEffect, useMemo } from "react";
import HeaderObject from "../../types/HeaderObject";
import { FilterCondition, EnumFilterOperator } from "../../types/FilterTypes";
import FilterContainer from "./shared/FilterContainer";
import FilterSection from "./shared/FilterSection";
import FilterActions from "./shared/FilterActions";
import FilterInput from "./shared/FilterInput";
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

  // Work with string values instead of full EnumOption objects
  const allValues = useMemo(() => enumOptions.map((option) => option.value), [enumOptions]);

  // Default to all option values selected if no current filter
  const [selectedValues, setSelectedValues] = useState<string[]>(
    currentFilter?.values ? currentFilter.values.map(String) : allValues
  );

  // Search state for filtering options
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Always use "in" operator for enum filters since it's the most logical
  const selectedOperator: EnumFilterOperator = "in";

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return enumOptions;
    const lowerSearch = searchTerm.toLowerCase();
    return enumOptions.filter((option) => option.label.toLowerCase().includes(lowerSearch));
  }, [enumOptions, searchTerm]);

  // Reset form when current filter changes
  useEffect(() => {
    if (currentFilter) {
      setSelectedValues(currentFilter.values ? currentFilter.values.map(String) : []);
    } else {
      // If no filter, default to all option values selected
      setSelectedValues(allValues);
    }
  }, [currentFilter, allValues]);

  const handleValueToggle = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSelectAllToggle = (checked: boolean) => {
    // Always select or deselect all values, regardless of search filter
    if (checked) {
      setSelectedValues(allValues);
    } else {
      setSelectedValues([]);
    }
  };

  const handleApplyFilter = () => {
    // If all values are selected, clear the filter instead of applying it
    // because selecting all values is equivalent to no filter
    if (selectedValues.length === allValues.length) {
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
    if (selectedValues.length === allValues.length) return false;

    // Can apply if some but not all values are selected
    return true;
  };

  // Check if all options are selected
  const isAllSelected = selectedValues.length === allValues.length;

  // Show search input if there are more than 10 options
  const showSearch = enumOptions.length > 10;

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

          {/* Search input for large lists */}
          {showSearch && (
            <div className="st-enum-search">
              <FilterInput
                type="text"
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search..."
              />
            </div>
          )}
          {/* Individual option checkboxes */}
          {filteredOptions.map((option, index) => (
            <Checkbox
              key={index}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleValueToggle(option.value)}
            >
              <span className="st-enum-option-label">{option.label}</span>
            </Checkbox>
          ))}

          {/* No results message */}
          {searchTerm && filteredOptions.length === 0 && (
            <div className="st-enum-no-results">No matching options</div>
          )}
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
