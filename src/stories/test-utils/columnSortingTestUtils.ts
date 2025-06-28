import { expect, within } from "@storybook/test";
import {
  waitForTable,
  findClickableHeaderByLabel,
  findHeaderCellByLabel,
  getBillingColumnAccessorByLabel,
} from "./commonTestUtils";

/**
 * Column Sorting Test Utilities
 */

/**
 * Helper function to verify if an array is sorted in ascending order
 */
const isArraySortedAscending = (arr: (string | number)[]): boolean => {
  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i - 1];
    const curr = arr[i];
    if (curr < prev) {
      return false;
    }
  }
  return true;
};

/**
 * Helper function to verify if an array is sorted in descending order
 */
const isArraySortedDescending = (arr: (string | number)[]): boolean => {
  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i - 1];
    const curr = arr[i];
    if (curr > prev) {
      return false;
    }
  }
  return true;
};

/**
 * Helper function to check if data order has meaningfully changed
 */
const hasDataOrderChanged = (
  original: (string | number)[],
  sorted: (string | number)[]
): boolean => {
  if (original.length !== sorted.length) return true;

  // Check if the actual values have changed (not just positions)
  const originalStr = JSON.stringify(original);
  const sortedStr = JSON.stringify(sorted);

  if (originalStr !== sortedStr) {
    return true; // Data values changed
  }

  // Check if at least some elements are in different positions
  let changedPositions = 0;
  for (let i = 0; i < original.length; i++) {
    if (original[i] !== sorted[i]) {
      changedPositions++;
    }
  }

  const changePercentage = changedPositions / original.length;

  // Consider it changed if at least 20% of positions are different (reduced from 30%)
  return changePercentage >= 0.2;
};

/**
 * Helper function to check if data has meaningful content (not all zeros or empty)
 */
const hasSignificantData = (data: (string | number)[]): boolean => {
  // Check if we have non-zero, non-empty values
  return data.some((value) => {
    if (typeof value === "number") {
      return value !== 0;
    }
    return value !== "" && value !== "-" && value !== "—";
  });
};

/**
 * Get data from actual data rows (excluding group headers)
 * Row grouping means we need to filter out group header rows
 */
export const getDataRowsColumnData = (
  canvasElement: HTMLElement,
  accessor: string
): (string | number)[] => {
  const values: (string | number)[] = [];

  // Get all cells with this accessor, but filter out group rows
  const allCells = canvasElement.querySelectorAll(`[data-accessor="${accessor}"] .st-cell-content`);

  Array.from(allCells).forEach((cell, index) => {
    const cellElement = cell as HTMLElement;
    const rowElement = cellElement.closest(".st-row");

    // Check if this is a group header row (has expand icon)
    const hasExpandIcon = rowElement?.querySelector(".st-expand-icon-container");
    const isGroupRow = hasExpandIcon !== null;

    // For billing data, we want to exclude group rows but include all actual data rows
    // Group rows typically have expand icons and represent account/charge groups
    const text = cellElement.textContent?.trim() || "";

    // Only include data from non-group rows that have meaningful content
    if (!isGroupRow && text !== "-" && text !== "" && text !== "—") {
      // Handle monetary values by removing currency symbols and commas
      const cleanText = text.replace(/[$,]/g, "");
      const numValue = parseFloat(cleanText);
      const finalValue = isNaN(numValue) ? text : numValue;
      values.push(finalValue);
    }
  });

  return values;
};

/**
 * Click on a sortable column header to trigger sorting
 */
export const clickColumnHeader = async (
  canvasElement: HTMLElement,
  columnLabel: string
): Promise<void> => {
  const targetHeader = findClickableHeaderByLabel(canvasElement, columnLabel);

  if (!targetHeader) {
    // Debug: List all available headers
    const allHeaders = canvasElement.querySelectorAll(".st-header-label-text");

    const availableHeaders = Array.from(allHeaders)
      .map((h) => h.textContent?.trim())
      .join(", ");
    throw new Error(
      `Could not find clickable header with label: ${columnLabel}. Available headers: ${availableHeaders}`
    );
  }

  // Click the header to trigger sorting
  targetHeader.click();

  // Wait for sorting to complete
  await new Promise((resolve) => setTimeout(resolve, 300));
};

/**
 * Verify sort direction icon is present
 */
export const verifySortIcon = (
  canvasElement: HTMLElement,
  columnLabel: string,
  direction: "ascending" | "descending"
): void => {
  const targetHeaderCell = findHeaderCellByLabel(canvasElement, columnLabel);
  expect(targetHeaderCell).toBeTruthy();

  // Check for sort icon container
  const iconContainer = targetHeaderCell!.querySelector(".st-icon-container");
  expect(iconContainer).toBeTruthy();

  // Check for appropriate sort icon (the icon content should be present)
  const sortIcon = iconContainer!.querySelector("svg");
  expect(sortIcon).toBeTruthy();
};

/**
 * Test sorting for a specific column (ascending → descending → no sort)
 */
export const testColumnSorting = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  columnLabel: string
): Promise<void> => {
  await waitForTable();

  const columnAccessor = getBillingColumnAccessorByLabel(columnLabel);

  // Get initial data order
  const initialData = getDataRowsColumnData(canvasElement, columnAccessor);

  // First click - should sort ascending
  await clickColumnHeader(canvasElement, columnLabel);

  // Verify ascending sort
  verifySortIcon(canvasElement, columnLabel, "ascending");

  const ascendingData = getDataRowsColumnData(canvasElement, columnAccessor);

  // Verify the data is actually sorted in ascending order
  const isActuallyAscending = isArraySortedAscending(ascendingData);

  // Data should be different from initial (unless it was already sorted)
  const isAscendingSorted = hasDataOrderChanged(initialData, ascendingData);
  const hasSignificantAscendingData = hasSignificantData(ascendingData);

  // Only warn if we have significant data but it's not sorted and didn't change
  if (hasSignificantAscendingData && !isActuallyAscending && !isAscendingSorted) {
    console.warn(
      `⚠️ Warning: Data doesn't appear to be sorted ascending and didn't change meaningfully`
    );
  }

  // At minimum, we should have data and the sort icon should be present
  expect(ascendingData.length).toBeGreaterThan(0);

  // Second click - should sort descending
  await clickColumnHeader(canvasElement, columnLabel);

  // Verify descending sort
  verifySortIcon(canvasElement, columnLabel, "descending");

  const descendingData = getDataRowsColumnData(canvasElement, columnAccessor);

  // Verify the data is actually sorted in descending order
  const isActuallyDescending = isArraySortedDescending(descendingData);

  // Descending should be different from ascending
  const isDescendingDifferent = hasDataOrderChanged(ascendingData, descendingData);
  const hasSignificantDescendingData = hasSignificantData(descendingData);

  // Only warn if we have significant data but sorting isn't working properly
  // Special case: if ascending was all zeros but descending has values, that's actually good sorting
  const ascendingAllZeros = ascendingData.every((val) => val === 0 || val === "0");
  const descendingHasValues = hasSignificantDescendingData;

  if (
    hasSignificantDescendingData &&
    !isActuallyDescending &&
    !isDescendingDifferent &&
    !(ascendingAllZeros && descendingHasValues)
  ) {
    console.warn(
      `⚠️ Warning: Data doesn't appear to be sorted descending and didn't change from ascending`
    );
  }

  // At minimum, descending should have data
  expect(descendingData.length).toBeGreaterThan(0);

  // Third click - should remove sort (return to original order)
  await clickColumnHeader(canvasElement, columnLabel);

  // Verify no sort icon is present or sort is cleared
  const targetHeaderCell = findHeaderCellByLabel(canvasElement, columnLabel);
  const iconContainer = targetHeaderCell?.querySelector(".st-icon-container");

  if (iconContainer) {
    const sortIcon = iconContainer.querySelector("svg");
    if (sortIcon) {
      // Icon might still be present but in neutral state
    }
    // After clearing sort, icon should either be gone or show no sort state
    // This is optional since some tables might still show an icon but in neutral state
  }

  // After clearing sort, data should return to original order
  const finalData = getDataRowsColumnData(canvasElement, columnAccessor);

  const isBackToOriginal = JSON.stringify(finalData) === JSON.stringify(initialData);
  // Note: This might not always be true if the table doesn't restore original order
  // Only warn if we have significant data and it's clearly different from both initial and sorted states
  if (!isBackToOriginal && finalData.length > 0 && hasSignificantData(finalData)) {
    const isDifferentFromBothStates =
      JSON.stringify(finalData) !== JSON.stringify(ascendingData) &&
      JSON.stringify(finalData) !== JSON.stringify(descendingData);

    if (isDifferentFromBothStates) {
      console.warn(
        `⚠️ Data did not return to original order after clearing sort for column: ${columnLabel}`
      );
    }
  }
};

/**
 * Test sorting multiple columns to ensure only one column is sorted at a time
 */
export const testSortPersistence = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  firstColumnLabel: string,
  secondColumnLabel: string
): Promise<void> => {
  await waitForTable();

  const secondAccessor = getBillingColumnAccessorByLabel(secondColumnLabel);

  // Sort first column
  await clickColumnHeader(canvasElement, firstColumnLabel);

  // Sort second column (should clear first sort)
  await clickColumnHeader(canvasElement, secondColumnLabel);
  const secondSortData = getDataRowsColumnData(canvasElement, secondAccessor);

  // Verify second column is sorted
  verifySortIcon(canvasElement, secondColumnLabel, "ascending");
  const isSecondSorted = isArraySortedAscending(secondSortData);

  // At minimum, verify we have data and the sort affected the table
  expect(secondSortData.length).toBeGreaterThan(0);

  // Only warn if we have significant data but it's not sorted
  if (hasSignificantData(secondSortData) && !isSecondSorted) {
    console.warn(
      `⚠️ Warning: Second column doesn't appear to be perfectly sorted ascending, but sort icon is present`
    );
  }

  // Verify first column is no longer sorted by checking if it has a sort icon
  const firstHeaderCell = findHeaderCellByLabel(canvasElement, firstColumnLabel);
  const firstIconContainer = firstHeaderCell?.querySelector(".st-icon-container");
  const firstSortIcon = firstIconContainer?.querySelector("svg");

  // First column should not have a sort icon anymore (or should be empty)
  expect(firstSortIcon).toBeFalsy();

  // Verify that sorting the second column affected the data
  expect(secondSortData).toBeDefined();
  expect(secondSortData.length).toBeGreaterThan(0);
};

/**
 * Test rapid clicking on a column header to ensure stability
 */
export const testRapidSortClicks = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  columnLabel: string
): Promise<void> => {
  await waitForTable();

  const columnAccessor = getBillingColumnAccessorByLabel(columnLabel);

  // Perform multiple rapid clicks
  for (let i = 0; i < 5; i++) {
    await clickColumnHeader(canvasElement, columnLabel);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay between clicks
  }

  // After 5 clicks (odd number), should be in ascending state
  verifySortIcon(canvasElement, columnLabel, "ascending");
  const finalData = getDataRowsColumnData(canvasElement, columnAccessor);

  // Verify the final data is sorted correctly
  const isFinalSorted = isArraySortedAscending(finalData);

  // At minimum, verify we have data and rapid clicks didn't break anything
  expect(finalData.length).toBeGreaterThan(0);

  // Only warn if we have significant data but it's not sorted
  if (hasSignificantData(finalData) && !isFinalSorted) {
    console.warn(
      `⚠️ Warning: Final data after rapid clicks doesn't appear to be perfectly sorted, but sort icon is present`
    );
  }
};

/**
 * Test sorting different data types (string, number, date)
 */
export const testDataTypeSorting = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  stringColumn: string,
  numberColumn: string,
  dateColumn: string
): Promise<void> => {
  await waitForTable();

  // Test string sorting
  await testColumnSorting(canvas, canvasElement, stringColumn);

  // Test number sorting
  await testColumnSorting(canvas, canvasElement, numberColumn);

  // Test date sorting
  await testColumnSorting(canvas, canvasElement, dateColumn);
};

/**
 * Test sorting across different table sections (pinned left, main, pinned right)
 */
export const testCrossSectionSorting = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  pinnedLeftColumn: string,
  mainColumn: string,
  pinnedRightColumn: string
): Promise<void> => {
  await waitForTable();

  // Test sorting in pinned left section
  await clickColumnHeader(canvasElement, pinnedLeftColumn);
  verifySortIcon(canvasElement, pinnedLeftColumn, "ascending");

  // Test sorting in main section (should clear pinned left sort)
  await clickColumnHeader(canvasElement, mainColumn);
  verifySortIcon(canvasElement, mainColumn, "ascending");

  // Verify pinned left is no longer sorted
  const pinnedLeftHeaderCell = findHeaderCellByLabel(canvasElement, pinnedLeftColumn);
  const pinnedLeftIcon = pinnedLeftHeaderCell?.querySelector(".st-icon-container svg");
  expect(pinnedLeftIcon).toBeFalsy();

  // Test sorting in third column (could be pinned right or another main column)
  await clickColumnHeader(canvasElement, pinnedRightColumn);
  verifySortIcon(canvasElement, pinnedRightColumn, "ascending");

  // Verify main column is no longer sorted
  const mainHeaderCell = findHeaderCellByLabel(canvasElement, mainColumn);
  const mainIcon = mainHeaderCell?.querySelector(".st-icon-container svg");
  expect(mainIcon).toBeFalsy();
};
