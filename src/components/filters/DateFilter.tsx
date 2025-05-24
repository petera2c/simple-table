import React from "react";
import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
import StringFilter from "./StringFilter";

interface DateFilterProps {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
}

// Temporary implementation - reusing StringFilter logic for now
const DateFilter: React.FC<DateFilterProps> = (props) => {
  return <StringFilter {...props} />;
};

export default DateFilter;
