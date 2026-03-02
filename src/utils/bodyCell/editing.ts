import CellValue from "../../types/CellValue";
import { setNestedValue } from "../rowUtils";
import { AbsoluteBodyCell, CellRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";

// Create editable input for inline editing
export const createEditableInput = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  currentValue: CellValue,
  onComplete: () => void,
): HTMLElement => {
  const { header, row, rowIndex } = cell;

  const input = document.createElement("input");
  input.className = "editable-cell-input";
  input.type = "text";
  input.value = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
  input.setAttribute("autofocus", "true");

  // Focus the input
  setTimeout(() => input.focus(), 0);

  const handleBlur = () => {
    let newValue: CellValue = input.value;

    // Convert to appropriate type
    if (header.type === "number") {
      const numValue = parseFloat(input.value);
      newValue = isNaN(numValue) ? 0 : numValue;
    } else if (header.type === "boolean") {
      newValue = input.value.toLowerCase() === "true";
    }

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

  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    keyEvent.stopPropagation(); // Prevent table navigation

    if (keyEvent.key === "Enter" || keyEvent.key === "Escape") {
      input.blur();
    }
  };

  const handleMouseDown = (event: Event) => {
    event.stopPropagation(); // Prevent cell deselection
  };

  addTrackedEventListener(input, "blur", handleBlur);
  addTrackedEventListener(input, "keydown", handleKeyDown);
  addTrackedEventListener(input, "mousedown", handleMouseDown);

  return input;
};
