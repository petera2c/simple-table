import HeaderObject from "../../types/HeaderObject";
import { FilterCondition, EnumFilterOperator } from "../../types/FilterTypes";
import { createFilterActions } from "./createFilterActions";
import { createFilterInput } from "./createFilterInput";
import { createCheckbox } from "../columnEditor/createCheckbox";

export interface CreateEnumFilterOptions {
  header: HeaderObject;
  currentFilter?: FilterCondition;
  onApplyFilter: (filter: FilterCondition) => void;
  onClearFilter: () => void;
  containerRef?: HTMLElement;
  mainBodyRef?: HTMLElement;
}

export const createEnumFilter = (options: CreateEnumFilterOptions) => {
  let { header, currentFilter, onApplyFilter, onClearFilter } = options;

  const enumOptions = header.enumOptions || [];
  const allValues = enumOptions.map((option) => option.value);

  let selectedValues: string[] = currentFilter?.values
    ? currentFilter.values.map(String)
    : allValues;
  let searchTerm = "";

  const selectedOperator: EnumFilterOperator = "in";

  const container = document.createElement("div");
  container.className = "st-filter-container";

  const section = document.createElement("div");
  section.className = "st-filter-section";

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "st-enum-filter-options";

  const selectAllContainer = document.createElement("div");
  selectAllContainer.className = "st-enum-select-all";

  const selectAllCheckbox = createCheckbox({
    checked: selectedValues.length === allValues.length,
    onChange: (checked) => {
      if (checked) {
        selectedValues = [...allValues];
      } else {
        selectedValues = [];
      }
      renderOptions();
      if (filterActions) {
        filterActions.update({ canApply: canApply() });
      }
    },
  });

  const selectAllLabel = document.createElement("span");
  selectAllLabel.className = "st-enum-option-label st-enum-select-all-label";
  selectAllLabel.textContent = "Select All";

  selectAllContainer.appendChild(selectAllCheckbox.element);
  selectAllContainer.appendChild(selectAllLabel);
  optionsContainer.appendChild(selectAllContainer);

  let searchContainer: HTMLElement | null = null;
  let searchInput: ReturnType<typeof createFilterInput> | null = null;

  const showSearch = enumOptions.length > 10;

  if (showSearch) {
    searchContainer = document.createElement("div");
    searchContainer.className = "st-enum-search";

    searchInput = createFilterInput({
      type: "text",
      value: searchTerm,
      onChange: (value) => {
        searchTerm = value;
        renderOptions();
      },
      placeholder: "Search...",
    });

    searchContainer.appendChild(searchInput.element);
    optionsContainer.appendChild(searchContainer);
  }

  const optionCheckboxesContainer = document.createElement("div");
  optionsContainer.appendChild(optionCheckboxesContainer);

  const optionCheckboxes: Array<{
    container: HTMLElement;
    checkbox: ReturnType<typeof createCheckbox>;
    value: string;
  }> = [];

  const renderOptions = () => {
    optionCheckboxesContainer.innerHTML = "";
    optionCheckboxes.forEach((item) => item.checkbox.destroy());
    optionCheckboxes.length = 0;

    const filteredOptions = searchTerm
      ? enumOptions.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : enumOptions;

    if (searchTerm && filteredOptions.length === 0) {
      const noResults = document.createElement("div");
      noResults.className = "st-enum-no-results";
      noResults.textContent = "No matching options";
      optionCheckboxesContainer.appendChild(noResults);
    } else {
      filteredOptions.forEach((option) => {
        const optionContainer = document.createElement("div");

        const checkbox = createCheckbox({
          checked: selectedValues.includes(option.value),
          onChange: () => {
            if (selectedValues.includes(option.value)) {
              selectedValues = selectedValues.filter((v) => v !== option.value);
            } else {
              selectedValues = [...selectedValues, option.value];
            }
            const isAllSelected = selectedValues.length === allValues.length;
            selectAllCheckbox.element.querySelector("input")!.checked = isAllSelected;
            if (filterActions) {
              filterActions.update({ canApply: canApply() });
            }
          },
        });

        const label = document.createElement("span");
        label.className = "st-enum-option-label";
        label.textContent = option.label;

        optionContainer.appendChild(checkbox.element);
        optionContainer.appendChild(label);
        optionCheckboxesContainer.appendChild(optionContainer);

        optionCheckboxes.push({
          container: optionContainer,
          checkbox,
          value: option.value,
        });
      });
    }

    const isAllSelected = selectedValues.length === allValues.length;
    selectAllCheckbox.element.querySelector("input")!.checked = isAllSelected;
  };

  renderOptions();

  section.appendChild(optionsContainer);
  container.appendChild(section);

  const handleApplyFilter = () => {
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
    if (selectedValues.length === 0) return false;
    if (selectedValues.length === allValues.length) return false;
    return true;
  };

  const filterActions = createFilterActions({
    onApply: handleApplyFilter,
    onClear: onClearFilter,
    canApply: canApply(),
    showClear: !!currentFilter,
  });

  container.appendChild(filterActions.element);

  const update = (newOptions: Partial<CreateEnumFilterOptions>) => {
    if (newOptions.currentFilter !== undefined) {
      currentFilter = newOptions.currentFilter;
      selectedValues = currentFilter?.values ? currentFilter.values.map(String) : allValues;
      searchTerm = "";
      if (searchInput) {
        searchInput.update({ value: searchTerm });
      }
      renderOptions();
      if (filterActions) {
        filterActions.update({ showClear: !!currentFilter, canApply: canApply() });
      }
    }
  };

  const destroy = () => {
    selectAllCheckbox.destroy();
    if (searchInput) {
      searchInput.destroy();
    }
    optionCheckboxes.forEach((item) => item.checkbox.destroy());
    if (filterActions) {
      filterActions.destroy();
    }
    container.remove();
  };

  return { element: container, update, destroy };
};
