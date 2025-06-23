import { expect } from "@storybook/test";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";

/**
 * Row Height Test Utilities
 */

/**
 * Test that all visible rows have the correct height CSS property
 */
export const testRowHeight = async (
  canvasElement: HTMLElement,
  expectedRowHeight: number
): Promise<void> => {
  // Wait for table to render
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Get all visible rows (excluding separators)
  const rows = canvasElement.querySelectorAll(".st-row:not(.st-row-separator)");

  expect(rows.length).toBeGreaterThan(0);

  // Check each row has the correct height style
  rows.forEach((row) => {
    const heightStyle = (row as HTMLElement).style.height;
    expect(heightStyle).toBe(`${expectedRowHeight}px`);
  });
};

/**
 * Test that row separators are positioned correctly based on row height
 */
export const testRowSeparatorPositioning = async (
  canvasElement: HTMLElement,
  expectedRowHeight: number
): Promise<void> => {
  // Wait for table to render
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Get all row separators
  const separators = canvasElement.querySelectorAll(".st-row-separator");

  if (separators.length === 0) {
    // No separators to test
    return;
  }

  // Check each separator is positioned correctly
  separators.forEach((separator, index) => {
    const topStyle = (separator as HTMLElement).style.top;
    const expectedTop = (index + 1) * expectedRowHeight + index; // +index for separator height

    expect(topStyle).toBe(`${expectedTop}px`);
  });
};

/**
 * Test that the total body height is calculated correctly based on row height
 */
export const testTotalBodyHeight = async (
  canvasElement: HTMLElement,
  expectedRowHeight: number,
  rowCount: number
): Promise<void> => {
  // Wait for table to render
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Get the main body container
  const bodyMain = canvasElement.querySelector(".st-body-main");
  expect(bodyMain).toBeTruthy();

  if (bodyMain) {
    const computedStyle = window.getComputedStyle(bodyMain);
    const heightStyle = (bodyMain as HTMLElement).style.height;

    // Calculate expected total height: (rowHeight + separator) * rowCount - 1 separator
    // Based on the utils/infiniteScrollUtils.ts calculation
    const expectedTotalHeight =
      rowCount * (expectedRowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH;

    expect(heightStyle).toBe(`${expectedTotalHeight}px`);
    expect(computedStyle.height).toBe(`${expectedTotalHeight}px`);
  }
};

/**
 * Comprehensive row height test that checks rows, separators, and total height
 */
export const testCompleteRowHeight = async (
  canvasElement: HTMLElement,
  expectedRowHeight: number,
  rowCount: number
): Promise<void> => {
  // Test individual row heights
  await testRowHeight(canvasElement, expectedRowHeight);

  // Test row separator positioning
  await testRowSeparatorPositioning(canvasElement, expectedRowHeight);

  // Test total body height calculation
  await testTotalBodyHeight(canvasElement, expectedRowHeight, rowCount);
};

/**
 * Get the actual row height from the DOM for verification
 */
export const getActualRowHeight = (canvasElement: HTMLElement): number => {
  const firstRow = canvasElement.querySelector(".st-row:not(.st-row-separator)");
  if (!firstRow) {
    throw new Error("No rows found in table");
  }

  const heightStyle = (firstRow as HTMLElement).style.height;
  const match = heightStyle.match(/^(\d+)px$/);

  if (!match) {
    throw new Error(`Invalid height style: ${heightStyle}`);
  }

  return parseInt(match[1], 10);
};

/**
 * Wait for table to fully render with proper heights
 */
export const waitForTableWithRowHeight = async (timeout: number = 2000): Promise<void> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const table = document.querySelector(".simple-table-root");
    const rows = document.querySelectorAll(".st-row:not(.st-row-separator)");

    if (table && rows.length > 0) {
      // Check if first row has height style applied
      const firstRow = rows[0] as HTMLElement;
      if (firstRow.style.height) {
        return;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("Table with row heights did not render within timeout");
};
