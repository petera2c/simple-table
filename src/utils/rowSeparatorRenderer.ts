// Row separator and spacer renderers (vanilla JS/TS)
// Replaces TableRowSeparator.tsx React component

import {
  calculateRowTopPosition,
  calculateSeparatorTopPosition,
  HeightOffsets,
} from "./infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";

// Create a row separator element
export const createRowSeparator = (
  position: number,
  rowHeight: number,
  templateColumns: string,
  displayStrongBorder: boolean,
  heightOffsets: HeightOffsets | undefined,
  customTheme: CustomTheme,
  isSticky: boolean = false,
): HTMLElement => {
  const separator = document.createElement("div");
  separator.className = `st-row-separator ${displayStrongBorder ? "st-last-group-row" : ""}`;

  // Calculate position
  const topPosition = isSticky
    ? position
    : calculateSeparatorTopPosition({ position, rowHeight, heightOffsets, customTheme });

  // Apply styles
  separator.style.gridTemplateColumns = templateColumns;

  if (isSticky) {
    separator.style.position = "absolute";
    separator.style.top = "0";
    separator.style.left = "0";
    separator.style.transform = `translateY(${topPosition}px)`;
  } else {
    separator.style.transform = `translate3d(0, ${topPosition}px, 0)`;
  }

  // Create inner div that spans all columns
  const inner = document.createElement("div");
  inner.style.gridColumn = "1 / -1";
  separator.appendChild(inner);

  // Handle mouse events to pass through to cells below
  let targetCell: HTMLElement | null = null;

  const handleMouseDown = (event: MouseEvent) => {
    // Temporarily disable pointer events on separator to see through it
    const originalPointerEvents = separator.style.pointerEvents;
    separator.style.pointerEvents = "none";

    // Find the element at the click position (should be a cell)
    const elementUnderClick = document.elementFromPoint(event.clientX, event.clientY);

    // Restore pointer events
    separator.style.pointerEvents = originalPointerEvents;

    if (!elementUnderClick) return;

    // Find the closest cell element
    const cellElement = elementUnderClick.closest(".st-cell");

    if (cellElement instanceof HTMLElement) {
      targetCell = cellElement;

      // Get the actual bounding rect of the target cell
      const cellRect = cellElement.getBoundingClientRect();

      // Calculate mouse position - use original X, middle Y of cell
      const clientX = event.clientX;
      const clientY = cellRect.top + cellRect.height / 2;

      // Dispatch mousedown event to the cell
      const mouseDownEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0,
        clientX: clientX,
        clientY: clientY,
      });
      cellElement.dispatchEvent(mouseDownEvent);
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    // Only dispatch mouseup if we have a target cell from mousedown
    if (targetCell) {
      const cellRect = targetCell.getBoundingClientRect();

      const mouseUpEvent = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0,
        clientX: event.clientX,
        clientY: cellRect.top + cellRect.height / 2,
      });
      targetCell.dispatchEvent(mouseUpEvent);
      targetCell = null;
    }
  };

  separator.addEventListener("mousedown", handleMouseDown);
  separator.addEventListener("mouseup", handleMouseUp);

  return separator;
};

// Create a spacer row element (for state indicators and nested tables in pinned sections)
export const createSpacerRow = (
  position: number,
  rowHeight: number,
  gridTemplateColumns: string,
  heightOffsets: HeightOffsets | undefined,
  customTheme: CustomTheme,
  className: string,
  height?: number,
): HTMLElement => {
  const spacer = document.createElement("div");
  spacer.className = `st-row ${className}`;
  spacer.dataset.index = String(position);

  spacer.style.gridTemplateColumns = gridTemplateColumns;
  spacer.style.transform = `translate3d(0, ${calculateRowTopPosition({
    position,
    rowHeight,
    heightOffsets,
    customTheme,
  })}px, 0)`;
  spacer.style.height = `${height || rowHeight}px`;

  return spacer;
};
