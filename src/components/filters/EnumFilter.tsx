import React from "react";
import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
import StringFilter from "./StringFilter";

interface EnumFilterProps {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
}

// Temporary implementation - reusing StringFilter logic for now
const EnumFilter: React.FC<EnumFilterProps> = (props) => {
  return <StringFilter {...props} />;
};

export default EnumFilter;
