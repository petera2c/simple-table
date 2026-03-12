import { AbsoluteBodyCell, CellRenderContext } from "./types";
import { createCheckbox } from "../columnEditor/createCheckbox";

/**
 * Creates the row selection checkbox using the shared createCheckbox (same as popout and header).
 */
export const createSelectionCheckbox = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  isChecked: boolean,
): HTMLElement => {
  const checkbox = createCheckbox({
    checked: isChecked,
    onChange: (checked) => {
      context.handleRowSelect?.(String(cell.rowId), checked);
    },
    ariaLabel: `Select row ${cell.displayRowNumber + 1}`,
  });
  return checkbox.element;
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
