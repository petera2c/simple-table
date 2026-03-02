import { AbsoluteBodyCell, CellRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";

// Create selection checkbox
export const createSelectionCheckbox = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  isChecked: boolean,
): HTMLElement => {
  const checkboxContainer = document.createElement("label");
  checkboxContainer.className = "st-checkbox-container";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "st-checkbox";
  checkbox.checked = isChecked;
  checkbox.setAttribute("aria-label", `Select row ${cell.displayRowNumber + 1}`);

  const handleChange = () => {
    if (context.handleRowSelect) {
      context.handleRowSelect(String(cell.rowId), checkbox.checked);
    }
  };

  addTrackedEventListener(checkbox, "change", handleChange);

  // Prevent checkbox click from triggering cell selection
  const handleMouseDown = (event: Event) => {
    event.stopPropagation();
  };

  addTrackedEventListener(checkbox, "mousedown", handleMouseDown);

  checkboxContainer.appendChild(checkbox);

  return checkboxContainer;
};

// Create row number display
export const createRowNumber = (displayRowNumber: number): HTMLElement => {
  const rowNumber = document.createElement("span");
  rowNumber.className = "st-row-number";
  rowNumber.textContent = String(displayRowNumber + 1);
  return rowNumber;
};

// Create row buttons (placeholder for now - will be enhanced)
export const createRowButtons = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
): HTMLElement | null => {
  if (!context.rowButtons || context.rowButtons.length === 0) {
    return null;
  }

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "st-row-buttons";

  // For now, we'll skip rendering React components
  // This would require a React Portal or converting buttons to vanilla JS

  return buttonsContainer;
};
