import React from "react";
import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
import StringFilter from "./StringFilter";
import NumberFilter from "./NumberFilter";
import BooleanFilter from "./BooleanFilter";
import DateFilter from "./DateFilter";
import EnumFilter from "./EnumFilter";

interface FilterDropdownProps {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  header,
  currentFilter,
  onApplyFilter,
  onClearFilter,
}) => {
  const renderFilterComponent = () => {
    switch (header.type) {
      case "number":
        return (
          <NumberFilter
            header={header}
            currentFilter={currentFilter}
            onApplyFilter={onApplyFilter}
            onClearFilter={onClearFilter}
          />
        );
      case "boolean":
        return (
          <BooleanFilter
            header={header}
            currentFilter={currentFilter}
            onApplyFilter={onApplyFilter}
            onClearFilter={onClearFilter}
          />
        );
      case "date":
        return (
          <DateFilter
            header={header}
            currentFilter={currentFilter}
            onApplyFilter={onApplyFilter}
            onClearFilter={onClearFilter}
          />
        );
      case "enum":
        return (
          <EnumFilter
            header={header}
            currentFilter={currentFilter}
            onApplyFilter={onApplyFilter}
            onClearFilter={onClearFilter}
          />
        );
      default:
        return (
          <StringFilter
            header={header}
            currentFilter={currentFilter}
            onApplyFilter={onApplyFilter}
            onClearFilter={onClearFilter}
          />
        );
    }
  };

  return <>{renderFilterComponent()}</>;
};

export default FilterDropdown;
