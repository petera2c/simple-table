import HeaderObject from "../../types/HeaderObject";
import {
  FilterCondition,
  StringFilterOperator,
  getAvailableOperators,
  requiresSingleValue,
  requiresNoValue,
  FILTER_OPERATOR_LABELS,
} from "../../types/FilterTypes";
import { createCustomSelect } from "./createCustomSelect";
import { createFilterInput } from "./createFilterInput";
import { createFilterActions } from "./createFilterActions";

export interface CreateStringFilterOptions {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
  containerRef?: HTMLElement;
  mainBodyRef?: HTMLElement;
}

export const createStringFilter = (options: CreateStringFilterOptions) => {
  let { header, currentFilter, onApplyFilter, onClearFilter, containerRef, mainBodyRef } = options;

  let selectedOperator: StringFilterOperator =
    (currentFilter?.operator as StringFilterOperator) || "contains";
  let filterValue = String(currentFilter?.value || "");

  const availableOperators = getAvailableOperators("string") as StringFilterOperator[];

  const container = document.createElement("div");
  container.className = "st-filter-container";

  const operatorSection = document.createElement("div");
  operatorSection.className = "st-filter-section";

  const operatorSelect = createCustomSelect({
    value: selectedOperator,
    onChange: (value) => {
      selectedOperator = value as StringFilterOperator;
      render();
    },
    options: availableOperators.map((op) => ({
      value: op,
      label: FILTER_OPERATOR_LABELS[op],
    })),
    containerRef,
    mainBodyRef,
  });

  operatorSection.appendChild(operatorSelect.element);
  container.appendChild(operatorSection);

  let inputSection: HTMLElement | null = null;
  let filterInput: ReturnType<typeof createFilterInput> | null = null;

  let filterActions: ReturnType<typeof createFilterActions> | null = null;

  const handleApplyFilter = () => {
    const filter: FilterCondition = {
      accessor: header.accessor,
      operator: selectedOperator,
      ...(requiresSingleValue(selectedOperator) && { value: filterValue }),
    };

    onApplyFilter(filter);
  };

  const canApply = () => {
    return requiresNoValue(selectedOperator) || filterValue.trim() !== "";
  };

  const render = () => {
    if (inputSection) {
      inputSection.remove();
      inputSection = null;
    }
    if (filterInput) {
      filterInput.destroy();
      filterInput = null;
    }

    if (requiresSingleValue(selectedOperator)) {
      inputSection = document.createElement("div");
      inputSection.className = "st-filter-section";

      filterInput = createFilterInput({
        type: "text",
        value: filterValue,
        onChange: (value) => {
          filterValue = value;
          if (filterActions) {
            filterActions.update({ canApply: canApply() });
          }
        },
        onEnter: handleApplyFilter,
        placeholder: "Filter...",
        autoFocus: true,
      });

      inputSection.appendChild(filterInput.element);
      container.insertBefore(inputSection, container.lastChild);
    }

    if (filterActions) {
      filterActions.update({ canApply: canApply() });
    }
  };

  filterActions = createFilterActions({
    onApply: handleApplyFilter,
    onClear: onClearFilter,
    canApply: canApply(),
    showClear: !!currentFilter,
  });

  container.appendChild(filterActions.element);

  render();

  const update = (newOptions: Partial<CreateStringFilterOptions>) => {
    if (newOptions.currentFilter !== undefined) {
      currentFilter = newOptions.currentFilter;
      selectedOperator = (currentFilter?.operator as StringFilterOperator) || "contains";
      filterValue = String(currentFilter?.value || "");
      operatorSelect.update({ value: selectedOperator });
      if (filterInput) {
        filterInput.update({ value: filterValue });
      }
      if (filterActions) {
        filterActions.update({ showClear: !!currentFilter, canApply: canApply() });
      }
      render();
    }
  };

  const destroy = () => {
    operatorSelect.destroy();
    if (filterInput) {
      filterInput.destroy();
    }
    if (filterActions) {
      filterActions.destroy();
    }
    container.remove();
  };

  return { element: container, update, destroy };
};
