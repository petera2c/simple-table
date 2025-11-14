import Cell from "../types/Cell";
import { ROW_SEPARATOR_WIDTH } from "../consts/general-consts";

/**
 * Fine-tunes the scroll position when a cell is already in the DOM
 */
const fineTuneScroll = (
  cellElement: Element,
  tableContainer: Element,
  mainBody: Element | null
) => {
  const cellRect = cellElement.getBoundingClientRect();
  const containerRect = tableContainer.getBoundingClientRect();

  // Vertical scrolling
  const scrollMargin = 10; // pixels of margin around the cell
  if (cellRect.top < containerRect.top + scrollMargin) {
    // Cell is above viewport, scroll up
    tableContainer.scrollTop -= containerRect.top - cellRect.top + scrollMargin;
  } else if (cellRect.bottom > containerRect.bottom - scrollMargin) {
    // Cell is below viewport, scroll down
    tableContainer.scrollTop += cellRect.bottom - containerRect.bottom + scrollMargin;
  }

  // Horizontal scrolling (if mainBody exists)
  if (mainBody) {
    const mainBodyRect = mainBody.getBoundingClientRect();
    if (cellRect.left < mainBodyRect.left + scrollMargin) {
      // Cell is left of viewport, scroll left
      mainBody.scrollLeft -= mainBodyRect.left - cellRect.left + scrollMargin;
    } else if (cellRect.right > mainBodyRect.right - scrollMargin) {
      // Cell is right of viewport, scroll right
      mainBody.scrollLeft += cellRect.right - mainBodyRect.right + scrollMargin;
    }
  }
};

/**
 * Scrolls a cell into view, handling virtualization by calculating
 * approximate positions when cells are not yet rendered
 */
export const scrollCellIntoView = (cell: Cell, rowHeight: number) => {
  const tableContainer = document.querySelector(".st-body-container");
  const mainBody = document.querySelector(".st-body-main");

  if (!tableContainer) return;

  // Calculate the actual row height including separator
  const rowHeightWithSeparator = rowHeight + ROW_SEPARATOR_WIDTH;

  // Try to find the cell element using data attributes
  const cellElement = document.querySelector(
    `.st-cell[data-row-index="${cell.rowIndex}"][data-col-index="${cell.colIndex}"][data-row-id="${cell.rowId}"]`
  );

  // If cell is not in DOM (due to virtualization), scroll to calculated position
  if (!cellElement) {
    // Calculate target scroll position based on row index
    // Position the cell roughly in the middle of the viewport for better visibility
    const containerHeight = tableContainer.clientHeight;
    const targetScrollTop = cell.rowIndex * rowHeightWithSeparator - containerHeight / 3;

    // Scroll to calculated position (clamped to valid range)
    tableContainer.scrollTop = Math.max(0, targetScrollTop);

    // Wait for virtualization to render the cell, then fine-tune
    setTimeout(() => {
      const newCellElement = document.querySelector(
        `.st-cell[data-row-index="${cell.rowIndex}"][data-col-index="${cell.colIndex}"][data-row-id="${cell.rowId}"]`
      );

      if (newCellElement) {
        // Fine-tune the scroll position
        fineTuneScroll(newCellElement, tableContainer, mainBody);
      }
    }, 100);
    return;
  }

  // Cell is already in DOM, fine-tune scroll position
  fineTuneScroll(cellElement, tableContainer, mainBody);
};
