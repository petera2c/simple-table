import HeaderObject from "../../types/HeaderObject";
import {
  FilterCondition,
  NumberFilterOperator,
  getAvailableOperators,
  requiresSingleValue,
  requiresMultipleValues,
  requiresNoValue,
  FILTER_OPERATOR_LABELS,
} from "../../types/FilterTypes";
import { createCustomSelect } from "./createCustomSelect";
import { createFilterInput } from "./createFilterInput";
import { createFilterActions } from "./createFilterActions";

export interface CreateNumberFilterOptions {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
  containerRef?: HTMLElement;
  mainBodyRef?: HTMLElement;
}

export const createNumberFilter = (options: CreateNumberFilterOptions) => {
  let { header, currentFilter, onApplyFilter, onClearFilter, containerRef, mainBodyRef } = options;

  let selectedOperator: NumberFilterOperator =
    (currentFilter?.operator as NumberFilterOperator) || "equals";
  let filterValue = String(currentFilter?.value || "");
  let filterValueFrom = String(currentFilter?.values?.[0] || "");
  let filterValueTo = String(currentFilter?.values?.[1] || "");

  const availableOperators = getAvailableOperators("number") as NumberFilterOperator[];

  const container = document.createElement("div");
  container.className = "st-filter-container";

  const operatorSection = document.createElement("div");
  operatorSection.className = "st-filter-section";

  const operatorSelect = createCustomSelect({
    value: selectedOperator,
    onChange: (value) => {
      selectedOperator = value as NumberFilterOperator;
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
  let filterInputFrom: ReturnType<typeof createFilterInput> | null = null;
  let filterInputTo: ReturnType<typeof createFilterInput> | null = null;

  let filterActions: ReturnType<typeof createFilterActions> | null = null;

  const handleApplyFilter = () => {
    const filter: FilterCondition = {
      accessor: header.accessor,
      operator: selectedOperator,
    };

    if (requiresSingleValue(selectedOperator)) {
      filter.value = parseFloat(filterValue);
    } else if (requiresMultipleValues(selectedOperator)) {
      filter.values = [parseFloat(filterValueFrom), parseFloat(filterValueTo)];
    }

    onApplyFilter(filter);
  };

  const canApply = () => {
    if (requiresNoValue(selectedOperator)) return true;
    if (requiresSingleValue(selectedOperator)) return filterValue.trim() !== "";
    if (requiresMultipleValues(selectedOperator)) {
      return filterValueFrom.trim() !== "" && filterValueTo.trim() !== "";
    }
    return false;
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
    if (filterInputFrom) {
      filterInputFrom.destroy();
      filterInputFrom = null;
    }
    if (filterInputTo) {
      filterInputTo.destroy();
      filterInputTo = null;
    }

    if (requiresSingleValue(selectedOperator)) {
      inputSection = document.createElement("div");
      inputSection.className = "st-filter-section";

      filterInput = createFilterInput({
        type: "number",
        value: filterValue,
        onChange: (value) => {
          filterValue = value;
          if (filterActions) {
            filterActions.update({ canApply: canApply() });
          }
        },
        onEnter: handleApplyFilter,
        placeholder: "Enter number...",
        autoFocus: true,
      });

      inputSection.appendChild(filterInput.element);
      container.insertBefore(inputSection, container.lastChild);
    } else if (requiresMultipleValues(selectedOperator)) {
      inputSection = document.createElement("div");
      inputSection.className = "st-filter-section";

      filterInputFrom = createFilterInput({
        type: "number",
        value: filterValueFrom,
        onChange: (value) => {
          filterValueFrom = value;
          if (filterActions) {
            filterActions.update({ canApply: canApply() });
          }
        },
        onEnter: handleApplyFilter,
        placeholder: "From...",
        autoFocus: true,
      });
      filterInputFrom.element.classList.add("st-filter-input-range-from");

      filterInputTo = createFilterInput({
        type: "number",
        value: filterValueTo,
        onChange: (value) => {
          filterValueTo = value;
          if (filterActions) {
            filterActions.update({ canApply: canApply() });
          }
        },
        onEnter: handleApplyFilter,
        placeholder: "To...",
      });

      inputSection.appendChild(filterInputFrom.element);
      inputSection.appendChild(filterInputTo.element);
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

  const update = (newOptions: Partial<CreateNumberFilterOptions>) => {
    if (newOptions.currentFilter !== undefined) {
      currentFilter = newOptions.currentFilter;
      selectedOperator = (currentFilter?.operator as NumberFilterOperator) || "equals";
      filterValue = String(currentFilter?.value || "");
      filterValueFrom = String(currentFilter?.values?.[0] || "");
      filterValueTo = String(currentFilter?.values?.[1] || "");
      operatorSelect.update({ value: selectedOperator });
      if (filterInput) {
        filterInput.update({ value: filterValue });
      }
      if (filterInputFrom) {
        filterInputFrom.update({ value: filterValueFrom });
      }
      if (filterInputTo) {
        filterInputTo.update({ value: filterValueTo });
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
    if (filterInputFrom) {
      filterInputFrom.destroy();
    }
    if (filterInputTo) {
      filterInputTo.destroy();
    }
    if (filterActions) {
      filterActions.destroy();
    }
    container.remove();
  };

  return { element: container, update, destroy };
};
