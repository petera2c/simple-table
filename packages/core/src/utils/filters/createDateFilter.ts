import HeaderObject from "../../types/HeaderObject";
import {
  FilterCondition,
  DateFilterOperator,
  getAvailableOperators,
  requiresSingleValue,
  requiresMultipleValues,
  requiresNoValue,
  FILTER_OPERATOR_LABELS,
} from "../../types/FilterTypes";
import { createCustomSelect } from "./createCustomSelect";
import { createFilterActions } from "./createFilterActions";
import { createDatePicker } from "./createDatePicker";
import { createDropdown } from "./createDropdown";
import { createSafeDate } from "../dateUtils";

export interface CreateDateFilterOptions {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
  containerRef?: HTMLElement;
  mainBodyRef?: HTMLElement;
}

export const createDateFilter = (options: CreateDateFilterOptions) => {
  let { header, currentFilter, onApplyFilter, onClearFilter, containerRef, mainBodyRef } = options;

  let selectedOperator: DateFilterOperator =
    (currentFilter?.operator as DateFilterOperator) || "equals";
  let filterValue = currentFilter?.value ? String(currentFilter.value) : "";
  let filterValueFrom = currentFilter?.values?.[0] ? String(currentFilter.values[0]) : "";
  let filterValueTo = String(currentFilter?.values?.[1] || "");

  const availableOperators = getAvailableOperators("date") as DateFilterOperator[];

  const container = document.createElement("div");
  container.className = "st-filter-container";

  const operatorSection = document.createElement("div");
  operatorSection.className = "st-filter-section";

  const operatorSelect = createCustomSelect({
    value: selectedOperator,
    onChange: (value) => {
      selectedOperator = value as DateFilterOperator;
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
  let dateInputContainer: HTMLElement | null = null;
  let dateInputFromContainer: HTMLElement | null = null;
  let dateInputToContainer: HTMLElement | null = null;

  let dateInput: HTMLInputElement | null = null;
  let dateInputFrom: HTMLInputElement | null = null;
  let dateInputTo: HTMLInputElement | null = null;

  let datePicker: ReturnType<typeof createDatePicker> | null = null;
  let datePickerFrom: ReturnType<typeof createDatePicker> | null = null;
  let datePickerTo: ReturnType<typeof createDatePicker> | null = null;

  let dateDropdown: ReturnType<typeof createDropdown> | null = null;
  let dateDropdownFrom: ReturnType<typeof createDropdown> | null = null;
  let dateDropdownTo: ReturnType<typeof createDropdown> | null = null;

  let filterActions: ReturnType<typeof createFilterActions> | null = null;

  const handleApplyFilter = () => {
    const filter: FilterCondition = {
      accessor: header.accessor,
      operator: selectedOperator,
    };

    if (requiresSingleValue(selectedOperator)) {
      filter.value = filterValue;
    } else if (requiresMultipleValues(selectedOperator)) {
      filter.values = [filterValueFrom, filterValueTo];
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

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = createSafeDate(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const createDateInput = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    autoFocus: boolean = false
  ) => {
    const inputContainer = document.createElement("div");
    inputContainer.className = "st-date-input-container";
    inputContainer.style.position = "relative";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "st-filter-input";
    input.value = formatDateDisplay(value);
    input.placeholder = placeholder;
    input.readOnly = true;
    input.style.cursor = "pointer";

    if (autoFocus) {
      setTimeout(() => input.focus(), 0);
    }

    let isOpen = false;

    const currentDate = value ? createSafeDate(value) : new Date();

    const picker = createDatePicker({
      value: currentDate,
      onChange: (date) => {
        const isoString = date.toISOString().split("T")[0];
        onChange(isoString);
        input.value = formatDateDisplay(isoString);
        dropdown.setOpen(false);
        isOpen = false;
      },
      onClose: () => {
        dropdown.setOpen(false);
        isOpen = false;
      },
    });

    const dropdown = createDropdown({
      children: picker.element,
      containerRef,
      mainBodyRef,
      anchorElement: input,
      onClose: () => {
        isOpen = false;
      },
      open: false,
      overflow: "hidden",
      positioning: "absolute",
      width: 240,
    });

    inputContainer.appendChild(input);
    inputContainer.appendChild(dropdown.element);

    const handleInputClick = () => {
      isOpen = !isOpen;
      dropdown.setOpen(isOpen);
    };

    const handleInputKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        isOpen = !isOpen;
        dropdown.setOpen(isOpen);
      } else if (e.key === "Escape") {
        isOpen = false;
        dropdown.setOpen(false);
      }
    };

    input.addEventListener("click", handleInputClick);
    input.addEventListener("keydown", handleInputKeyDown);

    return {
      container: inputContainer,
      input,
      picker,
      dropdown,
      destroy: () => {
        input.removeEventListener("click", handleInputClick);
        input.removeEventListener("keydown", handleInputKeyDown);
        picker.destroy();
        dropdown.destroy();
        inputContainer.remove();
      },
    };
  };

  const render = () => {
    if (inputSection) {
      inputSection.remove();
      inputSection = null;
    }
    if (dateInputContainer) {
      dateInputContainer = null;
    }
    if (dateInputFromContainer) {
      dateInputFromContainer = null;
    }
    if (dateInputToContainer) {
      dateInputToContainer = null;
    }
    if (datePicker) {
      datePicker.destroy();
      datePicker = null;
    }
    if (datePickerFrom) {
      datePickerFrom.destroy();
      datePickerFrom = null;
    }
    if (datePickerTo) {
      datePickerTo.destroy();
      datePickerTo = null;
    }
    if (dateDropdown) {
      dateDropdown.destroy();
      dateDropdown = null;
    }
    if (dateDropdownFrom) {
      dateDropdownFrom.destroy();
      dateDropdownFrom = null;
    }
    if (dateDropdownTo) {
      dateDropdownTo.destroy();
      dateDropdownTo = null;
    }
    if (dateInput) {
      dateInput = null;
    }
    if (dateInputFrom) {
      dateInputFrom = null;
    }
    if (dateInputTo) {
      dateInputTo = null;
    }

    if (requiresSingleValue(selectedOperator)) {
      inputSection = document.createElement("div");
      inputSection.className = "st-filter-section";

      const dateInputObj = createDateInput(
        filterValue,
        (value) => {
          filterValue = value;
          if (filterActions) {
            filterActions.update({ canApply: canApply() });
          }
        },
        "Select date...",
        true
      );

      dateInputContainer = dateInputObj.container;
      dateInput = dateInputObj.input;
      datePicker = dateInputObj.picker;
      dateDropdown = dateInputObj.dropdown;

      inputSection.appendChild(dateInputContainer);
      container.insertBefore(inputSection, container.lastChild);
    } else if (requiresMultipleValues(selectedOperator)) {
      inputSection = document.createElement("div");
      inputSection.className = "st-filter-section";

      const dateInputFromObj = createDateInput(
        filterValueFrom,
        (value) => {
          filterValueFrom = value;
          if (filterActions) {
            filterActions.update({ canApply: canApply() });
          }
        },
        "From date...",
        true
      );
      dateInputFromObj.input.classList.add("st-filter-input-range-from");

      const dateInputToObj = createDateInput(
        filterValueTo,
        (value) => {
          filterValueTo = value;
          if (filterActions) {
            filterActions.update({ canApply: canApply() });
          }
        },
        "To date...",
        false
      );

      dateInputFromContainer = dateInputFromObj.container;
      dateInputFrom = dateInputFromObj.input;
      datePickerFrom = dateInputFromObj.picker;
      dateDropdownFrom = dateInputFromObj.dropdown;

      dateInputToContainer = dateInputToObj.container;
      dateInputTo = dateInputToObj.input;
      datePickerTo = dateInputToObj.picker;
      dateDropdownTo = dateInputToObj.dropdown;

      inputSection.appendChild(dateInputFromContainer);
      inputSection.appendChild(dateInputToContainer);
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

  const update = (newOptions: Partial<CreateDateFilterOptions>) => {
    if (newOptions.currentFilter !== undefined) {
      currentFilter = newOptions.currentFilter;
      selectedOperator = (currentFilter?.operator as DateFilterOperator) || "equals";
      filterValue = currentFilter?.value ? String(currentFilter.value) : "";
      filterValueFrom = currentFilter?.values?.[0] ? String(currentFilter.values[0]) : "";
      filterValueTo = String(currentFilter?.values?.[1] || "");
      operatorSelect.update({ value: selectedOperator });
      if (filterActions) {
        filterActions.update({ showClear: !!currentFilter, canApply: canApply() });
      }
      render();
    }
  };

  const destroy = () => {
    operatorSelect.destroy();
    if (datePicker) {
      datePicker.destroy();
    }
    if (datePickerFrom) {
      datePickerFrom.destroy();
    }
    if (datePickerTo) {
      datePickerTo.destroy();
    }
    if (dateDropdown) {
      dateDropdown.destroy();
    }
    if (dateDropdownFrom) {
      dateDropdownFrom.destroy();
    }
    if (dateDropdownTo) {
      dateDropdownTo.destroy();
    }
    if (filterActions) {
      filterActions.destroy();
    }
    container.remove();
  };

  return { element: container, update, destroy };
};
