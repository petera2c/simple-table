import CellValue from "../../types/CellValue";
import { getNestedValue, setNestedValue } from "../rowUtils";
import { AbsoluteBodyCell, CellRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";
import { createBooleanDropdown } from "./editors/booleanDropdown";
import { createEnumDropdown } from "./editors/enumDropdown";
import { createDatePicker } from "./editors/datePicker";

// Create editable input for inline text/number editing
export const createEditableInput = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  currentValue: CellValue,
  onComplete: () => void,
): HTMLElement => {
  const { header, row, rowIndex } = cell;

  const input = document.createElement("input");
  input.className = "editable-cell-input";

  // Set input type based on column type
  if (header.type === "number") {
    input.type = "text"; // Use text to allow decimal input
    input.inputMode = "decimal";
  } else {
    input.type = "text";
  }

  input.value = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
  input.setAttribute("autofocus", "true");


  // Focus the input
  setTimeout(() => {
    input.focus();
    input.select(); // Select all text for easy replacement
  }, 0);

  // Track if we should save or cancel
  let shouldSave = true;

  const handleBlur = (event: Event) => {
    const focusEvent = event as FocusEvent;

    if (!shouldSave) {
      // Escape was pressed - cancel edit without saving
      onComplete();
      return;
    }

    let newValue: CellValue = input.value;

    // Convert to appropriate type
    if (header.type === "number") {
      const numValue = parseFloat(input.value);
      newValue = isNaN(numValue) ? 0 : numValue;
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

    if (keyEvent.key === "Enter") {
      shouldSave = true;
      input.blur();
    } else if (keyEvent.key === "Escape") {
      shouldSave = false;
      input.blur();
    }
  };

  const handleMouseDown = (event: Event) => {
    event.stopPropagation(); // Prevent cell deselection
  };

  // For number inputs, validate numeric input
  if (header.type === "number") {
    const handleInput = () => {
      const value = input.value;
      // Allow numbers, decimal point, and minus sign
      if (!/^-?\d*\.?\d*$/.test(value)) {
        input.value = value.slice(0, -1);
      }
    };
    addTrackedEventListener(input, "input", handleInput);
  }

  addTrackedEventListener(input, "blur", handleBlur);
  addTrackedEventListener(input, "keydown", handleKeyDown);
  addTrackedEventListener(input, "mousedown", handleMouseDown);

  return input;
};

// Create appropriate editor based on column type
export const createEditor = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  onComplete: () => void,
): HTMLElement | null => {
  const { header, row } = cell;
  const currentValue = getNestedValue(row, header.accessor);

  // Use dropdown editors for boolean, enum, and date types
  if (header.type === "boolean") {
    return createBooleanDropdown(cell, context, Boolean(currentValue), onComplete);
  }

  if (header.type === "enum") {
    return createEnumDropdown(cell, context, String(currentValue || ""), onComplete);
  }

  if (header.type === "date") {
    return createDatePicker(cell, context, currentValue, onComplete);
  }

  // Use inline input for text and number types
  return createEditableInput(cell, context, currentValue, onComplete);
};
