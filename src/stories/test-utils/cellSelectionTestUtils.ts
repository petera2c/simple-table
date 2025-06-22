import { expect } from "@storybook/test";
import { waitForTable } from "./commonTestUtils";

/**
 * Cell Selection Test Utilities
 *
 * These utilities help test cell selection functionality including:
 * - Single cell selection
 * - Multi-cell selection
 * - Selection range validation
 * - Selection state verification
 */

/**
 * Debug function to log current table state
 */
export const logTableState = (canvasElement: HTMLElement): void => {
  console.log(`🔍 === TABLE STATE DEBUG ===`);

  // Basic table structure
  const tableRoot = canvasElement.querySelector(".simple-table-root");
  console.log(`📋 Table root:`, !!tableRoot);

  // All cells
  const allCells = canvasElement.querySelectorAll(".st-cell");
  console.log(`📊 Total cells: ${allCells.length}`);

  // Cells with IDs
  const cellsWithIds = canvasElement.querySelectorAll('[id^="cell-"]');
  console.log(`🆔 Cells with IDs: ${cellsWithIds.length}`);

  // Sample first 5 cell IDs
  const firstFiveCells = Array.from(cellsWithIds)
    .slice(0, 5)
    .map((cell) => cell.id);
  console.log(`🔗 First 5 cell IDs:`, firstFiveCells);

  // Selected cells
  const selectedCells = canvasElement.querySelectorAll(
    ".st-cell-selected, .st-cell-selected-first"
  );
  console.log(`✅ Selected cells: ${selectedCells.length}`);
  if (selectedCells.length > 0) {
    console.log(
      `🎯 Selected cell IDs:`,
      Array.from(selectedCells).map((cell) => cell.id)
    );
  }

  // Check if cells are clickable
  const clickableCells = canvasElement.querySelectorAll(".st-cell.clickable");
  console.log(`👆 Clickable cells: ${clickableCells.length}`);

  console.log(`🔍 === END TABLE STATE ===`);
};

export interface CellPosition {
  rowIndex: number;
  colIndex: number;
  accessor: string;
  rowId: string;
}

export interface SelectionRange {
  startCell: CellPosition;
  endCell: CellPosition;
}

/**
 * Get a cell element by its position
 */
export const getCellElement = (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number
): HTMLElement | null => {
  const cellId = `cell-${rowIndex}-${colIndex}`;
  console.log(`🔍 Looking for cell with ID: ${cellId}`);
  const cell = canvasElement.querySelector(`#${cellId}`) as HTMLElement;
  console.log(`🎯 Found cell:`, cell ? "YES" : "NO", cell?.tagName, cell?.className);
  return cell;
};

/**
 * Get a cell element by its row ID and accessor
 */
export const getCellByRowIdAndAccessor = (
  canvasElement: HTMLElement,
  rowId: string,
  accessor: string
): HTMLElement | null => {
  return canvasElement.querySelector(
    `[data-row-id="${rowId}"][data-accessor="${accessor}"]`
  ) as HTMLElement;
};

/**
 * Click on a cell to select it
 */
export const clickCell = async (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number
): Promise<void> => {
  console.log(`👆 Attempting to click cell at position [${rowIndex}, ${colIndex}]`);
  const cell = getCellElement(canvasElement, rowIndex, colIndex);

  if (!cell) {
    console.error(`❌ Cell not found at position [${rowIndex}, ${colIndex}]`);
    // Log available cells for debugging
    const allCells = canvasElement.querySelectorAll('[id^="cell-"]');
    console.log(
      `📊 Available cells (${allCells.length}):`,
      Array.from(allCells)
        .map((c) => c.id)
        .slice(0, 10)
    );
  }

  expect(cell).toBeInTheDocument();
  console.log(`🔍 Cell classes:`, cell?.className);
  console.log(`🎯 Has clickable class:`, cell?.classList.contains("clickable"));
  expect(cell).toHaveClass("clickable");

  console.log(`🖱️ Dispatching mousedown event on cell...`);
  // Use mousedown event as that's what triggers selection
  const mouseDownEvent = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    clientX: 0,
    clientY: 0,
  });
  cell!.dispatchEvent(mouseDownEvent);

  // Also dispatch mouseup to complete the interaction
  console.log(`🖱️ Dispatching mouseup event on cell...`);
  const mouseUpEvent = new MouseEvent("mouseup", {
    bubbles: true,
    cancelable: true,
  });
  cell!.dispatchEvent(mouseUpEvent);

  // Wait for selection to take effect (selection logic uses setTimeout)
  await new Promise((resolve) => setTimeout(resolve, 150));
  console.log(`✅ Mouse events completed, waited 150ms`);
};

/**
 * Click and drag to select a range of cells
 */
export const selectCellRange = async (
  canvasElement: HTMLElement,
  startRowIndex: number,
  startColIndex: number,
  endRowIndex: number,
  endColIndex: number
): Promise<void> => {
  console.log(
    `🎯 Selecting cell range from [${startRowIndex}, ${startColIndex}] to [${endRowIndex}, ${endColIndex}]`
  );

  const startCell = getCellElement(canvasElement, startRowIndex, startColIndex);
  const endCell = getCellElement(canvasElement, endRowIndex, endColIndex);

  expect(startCell).toBeInTheDocument();
  expect(endCell).toBeInTheDocument();

  console.log(`🖱️ Dispatching mousedown on start cell:`, startCell?.id);
  // Simulate mouse down on start cell
  const mouseDownEvent = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    clientX: 0,
    clientY: 0,
  });
  startCell!.dispatchEvent(mouseDownEvent);

  // Wait a bit for the mousedown to be processed
  await new Promise((resolve) => setTimeout(resolve, 10));

  // Simulate mouse over all cells in the range to trigger selection
  console.log(`🖱️ Simulating mouseover for range selection...`);
  const minRow = Math.min(startRowIndex, endRowIndex);
  const maxRow = Math.max(startRowIndex, endRowIndex);
  const minCol = Math.min(startColIndex, endColIndex);
  const maxCol = Math.max(startColIndex, endColIndex);

  // Trigger mouseover events on intermediate cells in the range
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const cell = getCellElement(canvasElement, row, col);
      if (cell) {
        console.log(`🖱️ Dispatching mouseover on cell [${row}, ${col}]:`, cell.id);
        const mouseOverEvent = new MouseEvent("mouseover", {
          bubbles: true,
          cancelable: true,
          clientX: 50,
          clientY: 50,
        });
        cell.dispatchEvent(mouseOverEvent);
        // Small delay between events
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    }
  }

  console.log(`🖱️ Dispatching mouseup on end cell:`, endCell?.id);
  // Simulate mouse up on end cell
  const mouseUpEvent = new MouseEvent("mouseup", {
    bubbles: true,
    cancelable: true,
  });
  endCell!.dispatchEvent(mouseUpEvent);

  // Wait for selection to take effect
  await new Promise((resolve) => setTimeout(resolve, 200));
  console.log(`✅ Range selection completed, waited 200ms`);
};

/**
 * Check if a cell is selected
 */
export const isCellSelected = (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number
): boolean => {
  const cell = getCellElement(canvasElement, rowIndex, colIndex);
  const hasSelected = cell?.classList.contains("st-cell-selected") || false;
  const hasSelectedFirst = cell?.classList.contains("st-cell-selected-first") || false;
  const isSelected = hasSelected || hasSelectedFirst;

  console.log(`🔍 Checking if cell [${rowIndex}, ${colIndex}] is selected:`);
  console.log(`  - st-cell-selected: ${hasSelected}`);
  console.log(`  - st-cell-selected-first: ${hasSelectedFirst}`);
  console.log(`  - Result: ${isSelected}`);
  console.log(`  - All classes:`, cell?.className);

  return isSelected;
};

/**
 * Check if a cell has specific selection border classes
 */
export const hasCellBorder = (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number,
  borderType: "top" | "bottom" | "left" | "right"
): boolean => {
  const cell = getCellElement(canvasElement, rowIndex, colIndex);
  return cell?.classList.contains(`st-selected-${borderType}-border`) || false;
};

/**
 * Get all selected cells
 */
export const getSelectedCells = (canvasElement: HTMLElement): HTMLElement[] => {
  return Array.from(canvasElement.querySelectorAll(".st-cell-selected, .st-cell-selected-first"));
};

/**
 * Get the count of selected cells
 */
export const getSelectedCellCount = (canvasElement: HTMLElement): number => {
  const selectedCells = getSelectedCells(canvasElement);
  console.log(`📊 Selected cell count: ${selectedCells.length}`);
  if (selectedCells.length > 0) {
    console.log(
      `🎯 Selected cells:`,
      selectedCells.map((cell) => cell.id)
    );
  }
  return selectedCells.length;
};

/**
 * Validate that a cell range is properly selected with correct borders
 */
export const validateCellRangeSelection = async (
  canvasElement: HTMLElement,
  startRowIndex: number,
  startColIndex: number,
  endRowIndex: number,
  endColIndex: number
): Promise<void> => {
  const minRow = Math.min(startRowIndex, endRowIndex);
  const maxRow = Math.max(startRowIndex, endRowIndex);
  const minCol = Math.min(startColIndex, endColIndex);
  const maxCol = Math.max(startColIndex, endColIndex);

  // Check that all cells in the range are selected
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      expect(isCellSelected(canvasElement, row, col)).toBe(true);
    }
  }

  // Check border classes for the selection rectangle
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      // Top border
      if (row === minRow) {
        expect(hasCellBorder(canvasElement, row, col, "top")).toBe(true);
      }
      // Bottom border
      if (row === maxRow) {
        expect(hasCellBorder(canvasElement, row, col, "bottom")).toBe(true);
      }
      // Left border
      if (col === minCol) {
        expect(hasCellBorder(canvasElement, row, col, "left")).toBe(true);
      }
      // Right border
      if (col === maxCol) {
        expect(hasCellBorder(canvasElement, row, col, "right")).toBe(true);
      }
    }
  }

  // Check that the first cell (top-left) has the special first selection class
  expect(
    getCellElement(canvasElement, minRow, minCol)?.classList.contains("st-cell-selected-first")
  ).toBe(true);
};

/**
 * Clear all cell selections by clicking outside the table
 */
export const clearCellSelection = async (canvasElement: HTMLElement): Promise<void> => {
  console.log(`🧹 Clearing cell selection...`);
  const beforeCount = getSelectedCellCount(canvasElement);
  console.log(`📊 Selected cells before clear: ${beforeCount}`);

  // Try clicking outside the table to trigger the outside click handler
  console.log(`🖱️ Dispatching mousedown outside table to clear selection`);

  // Create a mousedown event on the document body to simulate clicking outside
  const mouseDownEvent = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: 0,
    clientY: 0,
  });

  // Dispatch on document body to ensure it's outside the table
  document.body.dispatchEvent(mouseDownEvent);

  // Also try pressing Escape key as an alternative
  console.log(`⌨️ Dispatching Escape key to clear selection`);
  const escapeEvent = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(escapeEvent);

  await new Promise((resolve) => setTimeout(resolve, 100));

  const afterCount = getSelectedCellCount(canvasElement);
  console.log(`📊 Selected cells after clear: ${afterCount}`);
  console.log(`✅ Clear selection completed`);
};

/**
 * Test single cell selection
 */
export const testSingleCellSelection = async (
  canvasElement: HTMLElement,
  rowIndex: number = 1,
  colIndex: number = 1
): Promise<void> => {
  console.log(`🧪 Testing single cell selection at [${rowIndex}, ${colIndex}]`);

  console.log(`⏳ Waiting for table to be ready...`);
  await waitForTable();
  console.log(`✅ Table is ready`);

  // Debug: Show table structure
  const allCells = canvasElement.querySelectorAll(".st-cell");
  console.log(`📊 Total cells in table: ${allCells.length}`);
  const cellsWithIds = canvasElement.querySelectorAll('[id^="cell-"]');
  console.log(`🆔 Cells with IDs: ${cellsWithIds.length}`);

  // Clear any existing selection
  await clearCellSelection(canvasElement);

  // Click on a cell
  await clickCell(canvasElement, rowIndex, colIndex);

  // Verify the cell is selected
  console.log(`🔍 Verifying cell is selected...`);
  expect(isCellSelected(canvasElement, rowIndex, colIndex)).toBe(true);

  // Verify it has the correct selection classes
  const cell = getCellElement(canvasElement, rowIndex, colIndex);
  console.log(`🔍 Verifying cell has st-cell-selected-first class...`);
  expect(cell).toHaveClass("st-cell-selected-first");

  // Verify only one cell is selected
  console.log(`🔍 Verifying only one cell is selected...`);
  expect(getSelectedCellCount(canvasElement)).toBe(1);

  console.log(`✅ Single cell selection test completed`);
};

/**
 * Test multi-cell range selection
 */
export const testMultiCellRangeSelection = async (
  canvasElement: HTMLElement,
  startRowIndex: number = 0,
  startColIndex: number = 0,
  endRowIndex: number = 2,
  endColIndex: number = 2
): Promise<void> => {
  await waitForTable();

  // Clear any existing selection
  await clearCellSelection(canvasElement);

  // Select a range of cells
  await selectCellRange(canvasElement, startRowIndex, startColIndex, endRowIndex, endColIndex);

  // Validate the entire range is selected with proper borders
  await validateCellRangeSelection(
    canvasElement,
    startRowIndex,
    startColIndex,
    endRowIndex,
    endColIndex
  );

  // Verify the expected number of cells are selected
  const expectedCellCount =
    (Math.abs(endRowIndex - startRowIndex) + 1) * (Math.abs(endColIndex - startColIndex) + 1);
  expect(getSelectedCellCount(canvasElement)).toBe(expectedCellCount);
};

/**
 * Test cell selection persistence across interactions
 */
export const testCellSelectionPersistence = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  // Select a cell
  await clickCell(canvasElement, 1, 1);
  expect(isCellSelected(canvasElement, 1, 1)).toBe(true);

  // Click on another cell to change selection
  await clickCell(canvasElement, 2, 2);

  // Verify first cell is no longer selected
  expect(isCellSelected(canvasElement, 1, 1)).toBe(false);

  // Verify second cell is now selected
  expect(isCellSelected(canvasElement, 2, 2)).toBe(true);

  // Verify only one cell is selected
  expect(getSelectedCellCount(canvasElement)).toBe(1);
};

/**
 * Test that cells have the required clickable class
 */
export const testCellsAreClickable = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  // Get a sample of cells and verify they're clickable
  const cells = canvasElement.querySelectorAll(".st-cell");
  expect(cells.length).toBeGreaterThan(0);

  // Check first few cells
  for (let i = 0; i < Math.min(5, cells.length); i++) {
    const cell = cells[i] as HTMLElement;
    expect(cell).toHaveClass("clickable");
  }
};

/**
 * Comprehensive cell selection test
 */
export const testCellSelectionComprehensive = async (canvasElement: HTMLElement): Promise<void> => {
  // Test single cell selection
  await testSingleCellSelection(canvasElement, 1, 1);

  // Test multi-cell range selection
  await testMultiCellRangeSelection(canvasElement, 0, 0, 2, 2);

  // Test different range selection
  await testMultiCellRangeSelection(canvasElement, 1, 1, 3, 4);

  // Test selection persistence
  await testCellSelectionPersistence(canvasElement);

  // Test that cells are clickable
  await testCellsAreClickable(canvasElement);

  // Final cleanup
  await clearCellSelection(canvasElement);
};
