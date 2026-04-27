// Boolean dropdown editor (True/False selection)

import { getCellId } from "../../cellUtils";
import { AbsoluteBodyCell, CellRenderContext } from "../types";
import { setNestedValue } from "../../rowUtils";
import { createDropdown } from "./dropdown";
import { addTrackedEventListener } from "../eventTracking";

export const createBooleanDropdown = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  currentValue: boolean,
  onComplete: () => void,
): HTMLElement => {
  const { header, row, rowIndex } = cell;

  // Declare dropdown variable that will be set after creation
  let dropdown: HTMLElement;

  // Create True option
  const trueOption = document.createElement("div");
  trueOption.className = `st-dropdown-item ${currentValue === true ? "selected" : ""}`;
  trueOption.textContent = "True";
  trueOption.setAttribute("role", "option");
  trueOption.setAttribute("aria-selected", String(currentValue === true));
  trueOption.setAttribute("aria-disabled", "false");

  // Create False option
  const falseOption = document.createElement("div");
  falseOption.className = `st-dropdown-item ${currentValue === false ? "selected" : ""}`;
  falseOption.textContent = "False";
  falseOption.setAttribute("role", "option");
  falseOption.setAttribute("aria-selected", String(currentValue === false));
  falseOption.setAttribute("aria-disabled", "false");

  const handleSelect = (newValue: boolean) => {
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

  addTrackedEventListener(trueOption, "click", () => handleSelect(true));
  addTrackedEventListener(falseOption, "click", () => handleSelect(false));

  // Keyboard navigation
  const handleKeyDown = (event: Event) => {
    const e = event as KeyboardEvent;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      // Toggle focus between options
      if (document.activeElement === trueOption) {
        falseOption.focus();
      } else {
        trueOption.focus();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (document.activeElement === trueOption) {
        handleSelect(true);
      } else if (document.activeElement === falseOption) {
        handleSelect(false);
      }
    }
  };

  trueOption.setAttribute("tabindex", "0");
  falseOption.setAttribute("tabindex", "0");
  addTrackedEventListener(trueOption, "keydown", handleKeyDown);
  addTrackedEventListener(falseOption, "keydown", handleKeyDown);

  // Use DocumentFragment so items become direct children of st-dropdown-content
  const content = document.createDocumentFragment();
  content.appendChild(trueOption);
  content.appendChild(falseOption);

  // Get the cell element as trigger (use getCellId for consistency with body cell IDs)
  const cellId = getCellId({
    accessor: header.accessor,
    rowId: cell.stableRowKey ?? cell.rowId,
  });
  const cellElement = document.getElementById(cellId) as HTMLElement;

  // Create and show dropdown
  dropdown = createDropdown(cellElement || document.body, content, {
    width: 120,
    positioning: "fixed",
    onClose: onComplete,
  });

  return dropdown;
};
