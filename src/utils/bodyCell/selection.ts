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

// Create row buttons
export const createRowButtons = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
): HTMLElement | null => {
  if (!context.rowButtons || context.rowButtons.length === 0) {
    return null;
  }

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "st-row-buttons";
  buttonsContainer.setAttribute("role", "group");
  buttonsContainer.setAttribute("aria-label", `Actions for row ${cell.displayRowNumber + 1}`);

  // Create button props
  const buttonProps = {
    row: cell.row,
    rowIndex: cell.displayRowNumber,
  };

  // Render each button
  context.rowButtons.forEach((buttonFn, index) => {
    try {
      const buttonElement = buttonFn(buttonProps);
      
      // Wrap in span for consistent styling
      const buttonWrapper = document.createElement("span");
      buttonWrapper.className = "st-row-button";
      buttonWrapper.appendChild(buttonElement);
      
      buttonsContainer.appendChild(buttonWrapper);
    } catch (error) {
      console.error("Error rendering row button:", error);
    }
  });

  return buttonsContainer;
};
