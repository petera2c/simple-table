import HeaderObject from "../../types/HeaderObject";
import {
  FilterCondition,
  BooleanFilterOperator,
  getAvailableOperators,
  requiresSingleValue,
  requiresNoValue,
  FILTER_OPERATOR_LABELS,
} from "../../types/FilterTypes";
import { createCustomSelect } from "./createCustomSelect";
import { createFilterActions } from "./createFilterActions";

export interface CreateBooleanFilterOptions {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
  containerRef?: HTMLElement;
  mainBodyRef?: HTMLElement;
}

export const createBooleanFilter = (options: CreateBooleanFilterOptions) => {
  let { header, currentFilter, onApplyFilter, onClearFilter, containerRef, mainBodyRef } = options;

  let selectedOperator: BooleanFilterOperator =
    (currentFilter?.operator as BooleanFilterOperator) || "equals";
  let filterValue = currentFilter?.value !== undefined ? String(currentFilter.value) : "true";

  const availableOperators = getAvailableOperators("boolean") as BooleanFilterOperator[];

  const container = document.createElement("div");
  container.className = "st-filter-container";

  const operatorSection = document.createElement("div");
  operatorSection.className = "st-filter-section";

  const operatorSelect = createCustomSelect({
    value: selectedOperator,
    onChange: (value) => {
      selectedOperator = value as BooleanFilterOperator;
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

  let valueSection: HTMLElement | null = null;
  let valueSelect: ReturnType<typeof createCustomSelect> | null = null;

  let filterActions: ReturnType<typeof createFilterActions> | null = null;

  const handleApplyFilter = () => {
    const filter: FilterCondition = {
      accessor: header.accessor,
      operator: selectedOperator,
    };

    if (requiresSingleValue(selectedOperator)) {
      filter.value = filterValue === "true";
    }

    onApplyFilter(filter);
  };

  const canApply = () => {
    return requiresNoValue(selectedOperator) || filterValue !== "";
  };

  const booleanOptions = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
  ];

  const render = () => {
    if (valueSection) {
      valueSection.remove();
      valueSection = null;
    }
    if (valueSelect) {
      valueSelect.destroy();
      valueSelect = null;
    }

    if (requiresSingleValue(selectedOperator)) {
      valueSection = document.createElement("div");
      valueSection.className = "st-filter-section";

      valueSelect = createCustomSelect({
        value: filterValue,
        onChange: (value) => {
          filterValue = value;
          if (filterActions) {
            filterActions.update({ canApply: canApply() });
          }
        },
        options: booleanOptions,
        containerRef,
        mainBodyRef,
      });

      valueSection.appendChild(valueSelect.element);
      container.insertBefore(valueSection, container.lastChild);
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

  const update = (newOptions: Partial<CreateBooleanFilterOptions>) => {
    if (newOptions.currentFilter !== undefined) {
      currentFilter = newOptions.currentFilter;
      selectedOperator = (currentFilter?.operator as BooleanFilterOperator) || "equals";
      filterValue = currentFilter?.value !== undefined ? String(currentFilter.value) : "true";
      operatorSelect.update({ value: selectedOperator });
      if (valueSelect) {
        valueSelect.update({ value: filterValue });
      }
      if (filterActions) {
        filterActions.update({ showClear: !!currentFilter, canApply: canApply() });
      }
      render();
    }
  };

  const destroy = () => {
    operatorSelect.destroy();
    if (valueSelect) {
      valueSelect.destroy();
    }
    if (filterActions) {
      filterActions.destroy();
    }
    container.remove();
  };

  return { element: container, update, destroy };
};
