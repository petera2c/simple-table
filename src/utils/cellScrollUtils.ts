import Cell from "../types/Cell";
import { getViewportCalculations } from "./infiniteScrollUtils";
import TableRow from "../types/TableRow";
import { CustomTheme } from "../types/CustomTheme";
import { rowIdToString } from "./rowUtils";

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
 * Check if a row is fully visible in the viewport
 * Uses viewport calculations to determine if the entire row is within view
 */
const isRowFullyVisible = (
  rowIndex: number,
  tableContainer: Element,
  rowHeight: number,
  tableRows: TableRow[]
): boolean => {
  const scrollTop = tableContainer.scrollTop;
  const contentHeight = tableContainer.clientHeight;

  const calculations = getViewportCalculations({
    bufferRowCount: 0, // No buffer for visibility check
    contentHeight,
    rowHeight,
    scrollTop,
    tableRows,
    scrollDirection: "none",
  });

  const { startIndex, endIndex } = calculations.fullyVisible;
  return rowIndex >= startIndex && rowIndex < endIndex;
};

/**
 * Scrolls a cell into view, handling virtualization by calculating
 * approximate positions when cells are not yet rendered.
 * Uses viewport calculations to check if the cell is already fully visible
 * before performing any scroll operations.
 */
export const scrollCellIntoView = (
  cell: Cell,
  rowHeight: number,
  customTheme: CustomTheme,
  tableRows?: TableRow[]
) => {
  const tableContainer = document.querySelector(".st-body-container");
  const mainBody = document.querySelector(".st-body-main");

  if (!tableContainer) return;

  // Resolve table row index from rowId so scroll position is correct when cell.rowIndex is virtualized
  const resolvedTableRow = tableRows
    ? tableRows.findIndex(
        (r) => rowIdToString(r.rowId) === String(cell.rowId),
      )
    : -1;
  const tableRowIndex =
    resolvedTableRow >= 0 ? resolvedTableRow : cell.rowIndex;

  const rowHeightWithSeparator = rowHeight + customTheme.rowSeparatorWidth;

  // Find cell by rowId and colIndex only (DOM data-row-index is virtualized and changes after scroll)
  const cellElement = tableContainer.querySelector(
    `.st-cell[data-row-id="${cell.rowId}"][data-col-index="${cell.colIndex}"]`,
  );

  if (cellElement && tableRows) {
    const isFullyVisible = isRowFullyVisible(
      tableRowIndex,
      tableContainer,
      rowHeight,
      tableRows,
    );

    if (isFullyVisible) {
      fineTuneScroll(cellElement, tableContainer, mainBody);
      return;
    }
  }

  if (!cellElement) {
    const containerHeight = tableContainer.clientHeight;
    const targetScrollTop =
      tableRowIndex * rowHeightWithSeparator - containerHeight / 3;

    tableContainer.scrollTop = Math.max(0, targetScrollTop);

    setTimeout(() => {
      const newCellElement = tableContainer.querySelector(
        `.st-cell[data-row-id="${cell.rowId}"][data-col-index="${cell.colIndex}"]`,
      );

      if (newCellElement) {
        fineTuneScroll(newCellElement, tableContainer, mainBody);
      }
    }, 100);
    return;
  }

  fineTuneScroll(cellElement, tableContainer, mainBody);
};
