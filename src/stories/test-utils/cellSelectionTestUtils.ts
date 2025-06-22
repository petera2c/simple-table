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

/**
 * Find valid cell range bounds in the table
 */
export const findValidCellBounds = (
  canvasElement: HTMLElement
): {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
} => {
  const allCells = canvasElement.querySelectorAll('.st-cell[id^="cell-"]');
  let minRow = Infinity,
    maxRow = -1,
    minCol = Infinity,
    maxCol = -1;

  allCells.forEach((cell) => {
    const id = cell.id;
    const match = id.match(/^cell-(\d+)-(\d+)$/);
    if (match) {
      const row = parseInt(match[1]);
      const col = parseInt(match[2]);
      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);
    }
  });

  console.log(`📐 Valid cell bounds: rows [${minRow}-${maxRow}], cols [${minCol}-${maxCol}]`);
  return { minRow, maxRow, minCol, maxCol };
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

  if (!startCell) {
    console.error(`❌ Start cell not found at position [${startRowIndex}, ${startColIndex}]`);
    throw new Error(`Start cell not found at position [${startRowIndex}, ${startColIndex}]`);
  }
  if (!endCell) {
    console.error(`❌ End cell not found at position [${endRowIndex}, ${endColIndex}]`);
    throw new Error(`End cell not found at position [${endRowIndex}, ${endColIndex}]`);
  }

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
 * Get a header cell element by column index
 */
export const getHeaderElement = (
  canvasElement: HTMLElement,
  colIndex: number
): HTMLElement | null => {
  console.log(`🔍 Looking for header at column index ${colIndex}`);

  // Find all actual header cells (not data cells)
  const headers = canvasElement.querySelectorAll(".st-header-cell");
  console.log(`🔍 Found ${headers.length} header cells total`);

  // Log header info for debugging
  Array.from(headers).forEach((header, index) => {
    const headerElement = header as HTMLElement;
    console.log(`  Header ${index}: ID=${headerElement.id}, classes=${headerElement.className}`);
  });

  if (headers[colIndex]) {
    const headerElement = headers[colIndex] as HTMLElement;
    console.log(`🎯 Found header by index: ${headerElement.id || "no-id"}`);
    return headerElement;
  }

  console.log(`❌ Header not found for column ${colIndex}`);
  return null;
};

/**
 * Click on a column header to select the entire column
 */
export const clickColumnHeader = async (
  canvasElement: HTMLElement,
  colIndex: number
): Promise<void> => {
  console.log(`👆 Attempting to click column header at index ${colIndex}`);

  const header = getHeaderElement(canvasElement, colIndex);
  if (!header) {
    console.error(`❌ Header not found at index ${colIndex}`);
    // Log available headers for debugging
    const allHeaders = canvasElement.querySelectorAll(".st-header-cell");
    console.log(
      `📊 Available headers (${allHeaders.length}):`,
      Array.from(allHeaders).map((h, i) => `${i}: ${h.id || h.textContent?.trim()}`)
    );
    return;
  }

  console.log(`🔍 Header classes:`, header.className);
  console.log(`🎯 Has clickable class:`, header.classList.contains("clickable"));

  // Find the header label within the header cell - this is what handles column selection
  const headerLabel = header.querySelector(".st-header-label") as HTMLElement;
  if (!headerLabel) {
    console.error(`❌ Could not find .st-header-label within header`);
    return;
  }

  console.log(`🔍 Found header label:`, headerLabel.className);
  console.log(`🖱️ Dispatching click event on header label...`);

  // Use click event since that's what the header label listens for
  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    clientX: 0,
    clientY: 0,
  });
  headerLabel.dispatchEvent(clickEvent);

  // Wait for selection to take effect
  await new Promise((resolve) => setTimeout(resolve, 150));
  console.log(`✅ Header click completed, waited 150ms`);
};

/**
 * Check if a column is selected by verifying cells in that column have selection classes
 */
export const isColumnSelected = (canvasElement: HTMLElement, colIndex: number): boolean => {
  const cellsInColumn = canvasElement.querySelectorAll(`[data-col-index="${colIndex}"]`);
  console.log(`🔍 Checking column ${colIndex} selection - found ${cellsInColumn.length} cells`);

  if (cellsInColumn.length === 0) {
    console.log(`❌ No cells found for column ${colIndex}`);
    return false;
  }

  // Check if at least some cells in the column are selected
  let selectedCellsInColumn = 0;
  cellsInColumn.forEach((cell, index) => {
    const hasSelected = cell.classList.contains("st-cell-selected");
    const hasSelectedFirst = cell.classList.contains("st-cell-selected-first");
    if (hasSelected || hasSelectedFirst) {
      selectedCellsInColumn++;
    }
    if (index < 3) {
      // Log first few for debugging
      console.log(`  Cell ${index}: selected=${hasSelected}, selectedFirst=${hasSelectedFirst}`);
    }
  });

  console.log(
    `📊 Selected cells in column ${colIndex}: ${selectedCellsInColumn}/${cellsInColumn.length}`
  );
  return selectedCellsInColumn > 0;
};

/**
 * Scroll the table body vertically
 */
export const scrollTableVertically = async (
  canvasElement: HTMLElement,
  scrollTop: number
): Promise<void> => {
  console.log(`📜 Scrolling table vertically to ${scrollTop}px`);

  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) {
    console.error(`❌ Could not find .st-body-container`);
    return;
  }

  console.log(`🔍 Found body container, current scrollTop: ${bodyContainer.scrollTop}`);

  // Set scroll position
  bodyContainer.scrollTop = scrollTop;

  // Dispatch scroll event to trigger any scroll handlers
  const scrollEvent = new Event("scroll", { bubbles: true });
  bodyContainer.dispatchEvent(scrollEvent);

  // Wait for scroll to settle and any virtualization to update
  await new Promise((resolve) => setTimeout(resolve, 200));

  console.log(`✅ Scroll completed, new scrollTop: ${bodyContainer.scrollTop}`);
};

/**
 * Test column header selection
 */
export const testColumnHeaderSelection = async (
  canvasElement: HTMLElement,
  colIndex: number = 1
): Promise<void> => {
  console.log(`🧪 Testing column header selection for column ${colIndex}`);

  await waitForTable();

  // Clear any existing selection
  await clearCellSelection(canvasElement);

  // Click on the column header
  await clickColumnHeader(canvasElement, colIndex);

  // Verify the column is selected
  console.log(`🔍 Verifying column ${colIndex} is selected...`);
  expect(isColumnSelected(canvasElement, colIndex)).toBe(true);

  console.log(`✅ Column header selection test completed`);
};

/**
 * Test cell selection after scrolling
 */
export const testCellSelectionAfterScroll = async (
  canvasElement: HTMLElement,
  scrollTop: number = 300,
  testRowIndex: number = 5,
  testColIndex: number = 2
): Promise<void> => {
  console.log(
    `🧪 Testing cell selection after scrolling (scroll: ${scrollTop}px, cell: [${testRowIndex}, ${testColIndex}])`
  );

  await waitForTable();

  // Clear any existing selection
  await clearCellSelection(canvasElement);

  // Scroll the table
  await scrollTableVertically(canvasElement, scrollTop);

  // Log current table state after scroll
  logTableState(canvasElement);

  // Try to select a cell after scrolling
  console.log(`🎯 Attempting to select cell [${testRowIndex}, ${testColIndex}] after scroll...`);
  await clickCell(canvasElement, testRowIndex, testColIndex);

  // Verify the cell is selected
  console.log(`🔍 Verifying cell [${testRowIndex}, ${testColIndex}] is selected after scroll...`);
  expect(isCellSelected(canvasElement, testRowIndex, testColIndex)).toBe(true);

  // Verify only one cell is selected
  expect(getSelectedCellCount(canvasElement)).toBe(1);

  console.log(`✅ Cell selection after scroll test completed`);
};

/**
 * Test range selection after scrolling
 */
export const testRangeSelectionAfterScroll = async (
  canvasElement: HTMLElement,
  scrollTop: number = 200,
  startRow: number = 3,
  startCol: number = 1,
  endRow: number = 5,
  endCol: number = 3
): Promise<void> => {
  console.log(`🧪 Testing range selection after scrolling`);
  console.log(
    `  Scroll: ${scrollTop}px, Range: [${startRow},${startCol}] to [${endRow},${endCol}]`
  );

  await waitForTable();

  // Clear any existing selection
  await clearCellSelection(canvasElement);

  // Scroll the table
  await scrollTableVertically(canvasElement, scrollTop);

  // Try range selection after scrolling
  await selectCellRange(canvasElement, startRow, startCol, endRow, endCol);

  // Verify the range is selected
  const expectedCellCount = (endRow - startRow + 1) * (endCol - startCol + 1);
  console.log(`🔍 Verifying ${expectedCellCount} cells are selected after scroll...`);
  expect(getSelectedCellCount(canvasElement)).toBe(expectedCellCount);

  // Verify specific cells in the range
  await validateCellRangeSelection(canvasElement, startRow, startCol, endRow, endCol);

  console.log(`✅ Range selection after scroll test completed`);
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
  console.log(`🧪 Running comprehensive cell selection tests...`);

  // First, discover valid cell bounds
  const bounds = findValidCellBounds(canvasElement);

  // Test 1: Single cell selection
  console.log(`🧪 Test 1: Single cell selection`);
  await testSingleCellSelection(canvasElement, bounds.minRow, bounds.minCol);

  // Test 2: Multi-cell range selection (using valid bounds)
  console.log(`🧪 Test 2: Multi-cell range selection`);
  const rangeEndRow = Math.min(bounds.minRow + 2, bounds.maxRow);
  const rangeEndCol = Math.min(bounds.minCol + 2, bounds.maxCol);
  await testMultiCellRangeSelection(
    canvasElement,
    bounds.minRow,
    bounds.minCol,
    rangeEndRow,
    rangeEndCol
  );

  // Test 3: Different range selection
  console.log(`🧪 Test 3: Different range selection`);
  const altStartRow = Math.min(bounds.minRow + 1, bounds.maxRow);
  const altStartCol = Math.min(bounds.minCol + 1, bounds.maxCol);
  const altEndRow = Math.min(bounds.minRow + 3, bounds.maxRow);
  const altEndCol = Math.min(bounds.minCol + 3, bounds.maxCol);
  await testMultiCellRangeSelection(canvasElement, altStartRow, altStartCol, altEndRow, altEndCol);

  // Test 4: Column header selection
  console.log(`🧪 Test 4: Column header selection`);
  await testColumnHeaderSelection(canvasElement, 2);

  // Test 5: Cell selection after scrolling
  console.log(`🧪 Test 5: Cell selection after scrolling`);
  await testCellSelectionAfterScroll(canvasElement, 300, 5, 1);

  // Test 6: Range selection after scrolling
  console.log(`🧪 Test 6: Range selection after scrolling`);
  await testRangeSelectionAfterScroll(canvasElement, 200, 3, 1, 4, 3);

  // Test 7: Selection persistence
  console.log(`🧪 Test 7: Selection persistence`);
  await testCellSelectionPersistence(canvasElement);

  // Test 8: Ensure cells are clickable
  console.log(`🧪 Test 8: Cells are clickable`);
  await testCellsAreClickable(canvasElement);

  // Final cleanup
  console.log(`🧹 Final cleanup...`);
  await clearCellSelection(canvasElement);

  console.log(`✅ All comprehensive cell selection tests completed successfully!`);
};
