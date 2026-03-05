// Boolean dropdown editor (True/False selection)

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

  // Create dropdown content
  const content = document.createElement("div");
  content.className = "st-dropdown-items";

  // Create True option
  const trueOption = document.createElement("div");
  trueOption.className = `st-dropdown-item ${currentValue === true ? "selected" : ""}`;
  trueOption.textContent = "True";
  trueOption.setAttribute("role", "option");
  trueOption.setAttribute("aria-selected", String(currentValue === true));

  // Create False option
  const falseOption = document.createElement("div");
  falseOption.className = `st-dropdown-item ${currentValue === false ? "selected" : ""}`;
  falseOption.textContent = "False";
  falseOption.setAttribute("role", "option");
  falseOption.setAttribute("aria-selected", String(currentValue === false));

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

  content.appendChild(trueOption);
  content.appendChild(falseOption);

  // Get the cell element as trigger
  const cellElement = document.getElementById(
    `cell-${header.accessor}-${cell.rowId}`,
  ) as HTMLElement;

  // Create and show dropdown
  const dropdown = createDropdown(cellElement || document.body, content, {
    width: 120,
    positioning: "fixed",
    onClose: onComplete,
  });

  // Focus first option
  setTimeout(() => {
    if (currentValue === true) {
      trueOption.focus();
    } else {
      falseOption.focus();
    }
  }, 0);

  return dropdown;
};
