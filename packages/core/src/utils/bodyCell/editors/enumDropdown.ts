// Enum dropdown editor (custom options selection)

import { getCellId } from "../../cellUtils";
import { AbsoluteBodyCell, CellRenderContext } from "../types";
import { setNestedValue } from "../../rowUtils";
import { createDropdown } from "./dropdown";
import { addTrackedEventListener } from "../eventTracking";
import EnumOption from "../../../types/EnumOption";

export const createEnumDropdown = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  currentValue: string,
  onComplete: () => void,
): HTMLElement => {
  const { header, row, rowIndex } = cell;
  const options = header.enumOptions || [];

  // Declare dropdown variable that will be set after creation
  let dropdown: HTMLElement;

  const handleSelect = (newValue: string) => {
    // Update the row data
    setNestedValue(row, header.accessor, newValue);

    // Call onCellEdit callback
    if (context.onCellEdit) {
      context.onCellEdit({
        accessor: header.accessor,
        newValue,
        row,
        rowIndex,
      });
    }

    // Remove dropdown from DOM manually, then call onComplete
    dropdown.remove();
    onComplete();
  };

  // Create option elements
  const optionElements: HTMLElement[] = [];

  options.forEach((option: EnumOption, index: number) => {
    const optionElement = document.createElement("div");
    optionElement.className = `st-dropdown-item ${currentValue === option.value ? "selected" : ""}`;
    optionElement.textContent = option.label;
    optionElement.setAttribute("role", "option");
    optionElement.setAttribute("aria-selected", String(currentValue === option.value));
    optionElement.setAttribute("aria-disabled", "false");
    optionElement.setAttribute("tabindex", "0");
    optionElement.dataset.value = option.value;

    addTrackedEventListener(optionElement, "click", () => handleSelect(option.value));

    optionElements.push(optionElement);
  });

  // Keyboard navigation
  const handleKeyDown = (event: Event) => {
    const e = event as KeyboardEvent;
    const currentIndex = optionElements.findIndex((el) => el === document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % optionElements.length;
      optionElements[nextIndex].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + optionElements.length) % optionElements.length;
      optionElements[prevIndex].focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedElement = document.activeElement as HTMLElement;
      const value = selectedElement.dataset.value;
      if (value) {
        handleSelect(value);
      }
    }
  };

  optionElements.forEach((el) => {
    addTrackedEventListener(el, "keydown", handleKeyDown);
  });

  // Wrap items in st-enum-dropdown-content to match main branch structure (Dropdown > div.st-enum-dropdown-content > DropdownItems)
  const wrapper = document.createElement("div");
  wrapper.className = "st-enum-dropdown-content";
  optionElements.forEach((el) => wrapper.appendChild(el));

  // Get the cell element as trigger (use getCellId for consistency with body cell IDs)
  const cellId = getCellId({
    accessor: header.accessor,
    rowId: cell.stableRowKey ?? cell.rowId,
  });
  const cellElement = document.getElementById(cellId) as HTMLElement;

  // Create and show dropdown
  dropdown = createDropdown(cellElement || document.body, wrapper, {
    width: 150,
    maxHeight: 300,
    positioning: "fixed",
    onClose: onComplete,
  });

  // Focus selected option or first option
  setTimeout(() => {
    const selectedIndex = options.findIndex((opt) => opt.value === currentValue);
    if (selectedIndex >= 0 && optionElements[selectedIndex]) {
      optionElements[selectedIndex].focus();
      optionElements[selectedIndex].scrollIntoView({ block: "nearest" });
    } else if (optionElements.length > 0) {
      optionElements[0].focus();
    }
  }, 0);

  return dropdown;
};
