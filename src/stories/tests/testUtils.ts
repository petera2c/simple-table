/**
 * Shared test utilities for Storybook tests
 * These utilities work with the virtualized cell-based DOM structure
 */

/**
 * Get unique row count from virtualized cells
 * Since column virtualization removed .st-row wrappers, we count unique data-row-index values
 */
export const getRowCount = (container: HTMLElement): number => {
  const cells = container.querySelectorAll(".st-cell[data-row-index]");
  const uniqueRowIndices = new Set(
    Array.from(cells).map((cell) => cell.getAttribute("data-row-index"))
  );
  return uniqueRowIndices.size;
};

/**
 * Get all cells for a specific row index
 */
export const getCellsForRow = (container: HTMLElement, rowIndex: number): HTMLElement[] => {
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
      .map((idx) => parseInt(idx, 10))
  );
  return Array.from(uniqueIndices).sort((a, b) => a - b);
};

/**
 * Check if a row exists (has any cells rendered)
 */
export const rowExists = (container: HTMLElement, rowIndex: number): boolean => {
  const cell = container.querySelector(`.st-cell[data-row-index="${rowIndex}"]`);
  return cell !== null;
};

/**
 * Get row elements as virtual rows (groups cells by row index)
 * This mimics the old .st-row structure for backward compatibility with tests
 */
export const getVirtualRows = (container: HTMLElement): HTMLElement[][] => {
  const rowIndices = getUniqueRowIndices(container);
  return rowIndices.map((rowIndex) => getCellsForRow(container, rowIndex));
};
