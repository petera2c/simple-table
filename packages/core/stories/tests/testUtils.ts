/**
 * Shared test utilities for Storybook tests
 * These utilities work with the virtualized cell-based DOM structure
 */

import { expect } from "@storybook/test";

/**
 * Get unique row count from virtualized cells
 * Since column virtualization removed .st-row wrappers, we count unique data-row-index values
 */
export const getRowCount = (container: HTMLElement): number => {
  const cells = container.querySelectorAll(".st-cell[data-row-index]");
  const uniqueRowIndices = new Set(
    Array.from(cells).map((cell) => cell.getAttribute("data-row-index")),
  );
  return uniqueRowIndices.size;
};

/**
 * Get all cells for a specific row index
 */
export const getCellsForRow = (container: HTMLElement, rowIndex: string): HTMLElement[] => {
  const cells = container.querySelectorAll(`.st-cell[data-row-index="${rowIndex}"]`);
  return Array.from(cells) as HTMLElement[];
};

/**
 * Get all unique row indices from rendered cells
 */
export const getUniqueRowIndices = (container: HTMLElement): number[] => {
  const cells = container.querySelectorAll(".st-cell[data-row-index]");
  const uniqueIndices = new Set(
    Array.from(cells)
      .map((cell) => cell.getAttribute("data-row-index"))
      .filter((idx): idx is string => idx !== null)
      .map((idx) => parseInt(idx, 10)),
  );
  return Array.from(uniqueIndices).sort((a, b) => a - b);
};

/**
 * Check if a row exists (has any cells rendered)
 */
export const rowExists = (container: HTMLElement, rowIndex: string): boolean => {
  const cell = container.querySelector(`.st-cell[data-row-index="${rowIndex}"]`);
  return cell !== null;
};

/**
 * Get row elements as virtual rows (groups cells by row index)
 * This mimics the old .st-row structure for backward compatibility with tests
 */
export const getVirtualRows = (container: HTMLElement): HTMLElement[][] => {
  const rowIndices = getUniqueRowIndices(container);
  return rowIndices.map((rowIndex) => getCellsForRow(container, String(rowIndex)));
};

export const waitForTable = async (timeout = 5000): Promise<void> => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const table = document.querySelector(".simple-table-root");
    if (table) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Table did not render within timeout");
};

export const validateBasicTableStructure = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  const tableRoot = canvasElement.querySelector(".simple-table-root");
  if (!tableRoot) throw new Error("Table root not found");
  expect(tableRoot).toBeTruthy();

  const tableContent = canvasElement.querySelector(".st-content");
  if (!tableContent) throw new Error("Table content not found");
  expect(tableContent).toBeTruthy();

  const headerContainer = canvasElement.querySelector(".st-header-container");
  if (!headerContainer) throw new Error("Header container not found");
  expect(headerContainer).toBeTruthy();

  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) throw new Error("Body container not found");
  expect(bodyContainer).toBeTruthy();

  const cells = canvasElement.querySelectorAll(".st-cell");
  expect(cells.length).toBeGreaterThan(0);

  const headerMain = headerContainer.querySelector(".st-header-main");
  if (!headerMain) throw new Error("Header main not found");
  expect(headerMain).toBeTruthy();

  const bodyMain = bodyContainer.querySelector(".st-body-main");
  if (!bodyMain) throw new Error("Body main not found");
  expect(bodyMain).toBeTruthy();
};

export const validateColumnCount = (canvasElement: HTMLElement, expectedCount: number): void => {
  const headerCells = canvasElement.querySelectorAll(".st-header-cell");
  expect(headerCells.length).toBe(expectedCount);
};

export const validateRowCount = (canvasElement: HTMLElement, expectedCount: number): void => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) throw new Error("Body container not found");

  const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
  const uniqueRowIndices = new Set(
    Array.from(cells).map((cell) => cell.getAttribute("data-row-index")),
  );

  expect(uniqueRowIndices.size).toBe(expectedCount);
};

export const validateCellContent = (
  canvasElement: HTMLElement,
  rowIndex: number,
  accessor: string,
  expectedValue: string,
): void => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) throw new Error("Body container not found");

  const cells = bodyContainer.querySelectorAll(`[data-accessor="${accessor}"]`);
  const cell = cells[rowIndex] as HTMLElement | undefined;
  if (!cell) throw new Error(`Cell at row ${rowIndex} with accessor "${accessor}" not found`);
  expect(cell).toBeTruthy();

  const cellContent = cell.querySelector(".st-cell-content");
  expect(cellContent?.textContent?.trim()).toBe(expectedValue);
};

/** Pinned panes should be document-ordered: left → main → right in header and body (when present). */
export const expectPinnedSectionsDomOrder = (root: HTMLElement): void => {
  const follows = (a: Element, b: Element) =>
    (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

  const headerRoot = root.querySelector(".st-header-container");
  const hLeft = headerRoot?.querySelector(".st-header-pinned-left");
  const hMain = headerRoot?.querySelector(".st-header-main");
  const hRight = headerRoot?.querySelector(".st-header-pinned-right");
  if (hLeft && hMain) expect(follows(hLeft, hMain)).toBe(true);
  if (hMain && hRight) expect(follows(hMain, hRight)).toBe(true);

  const bodyRoot = root.querySelector(".st-body-container");
  const bLeft = bodyRoot?.querySelector(".st-body-pinned-left");
  const bMain = bodyRoot?.querySelector(".st-body-main");
  const bRight = bodyRoot?.querySelector(".st-body-pinned-right");
  if (bLeft && bMain) expect(follows(bLeft, bMain)).toBe(true);
  if (bMain && bRight) expect(follows(bMain, bRight)).toBe(true);
};
