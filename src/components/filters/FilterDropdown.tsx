import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
import StringFilter from "./StringFilter";
import NumberFilter from "./NumberFilter";
import BooleanFilter from "./BooleanFilter";
import DateFilter from "./DateFilter";
import EnumFilter from "./EnumFilter";

interface FilterDropdownProps<T> {
  header: HeaderObject<T>;
  currentFilter?: FilterCondition<T>;
  onApplyFilter: (filter: FilterCondition<T>) => void;
  onClearFilter: () => void;
}

const FilterDropdown = <T,>({
  header,
  currentFilter,
  onApplyFilter,
  onClearFilter,
}: FilterDropdownProps<T>) => {
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
