import HeaderObject from "../../types/HeaderObject";
import { FilterCondition } from "../../types/FilterTypes";
import { createStringFilter } from "./createStringFilter";
import { createNumberFilter } from "./createNumberFilter";
import { createBooleanFilter } from "./createBooleanFilter";
import { createDateFilter } from "./createDateFilter";
import { createEnumFilter } from "./createEnumFilter";

export interface CreateFilterDropdownOptions {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
  containerRef?: HTMLElement;
  mainBodyRef?: HTMLElement;
}

export const createFilterDropdown = (options: CreateFilterDropdownOptions) => {
  const { header } = options;

  switch (header.type) {
    case "string":
      return createStringFilter(options);
    case "number":
      return createNumberFilter(options);
    case "boolean":
      return createBooleanFilter(options);
    case "date":
      return createDateFilter(options);
    case "enum":
      return createEnumFilter(options);
    default:
      return createStringFilter(options);
  }
};
