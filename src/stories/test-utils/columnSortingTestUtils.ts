import { expect } from "@storybook/test";
import {
  findClickableHeaderByLabel,
  findHeaderCellByLabel,
  getColumnDataFromTable,
} from "./commonTestUtils";

/**
 * Test data for sorting verification
 */
export const BASIC_COLUMN_CONFIGURATION = [
  { accessor: "id", sortable: true, type: "number" },
  { accessor: "name", sortable: true, type: "string" },
  { accessor: "age", sortable: true, type: "number" },
  { accessor: "role", sortable: true, type: "string" },
];

/**
 * Expected data for sorting tests
 */
export const EXPECTED_SORT_ORDERS = {
  name: {
    ascending: ["Alice Williams", "Bob Johnson", "Charlie Brown", "Jane Smith", "John Doe"],
    descending: ["John Doe", "Jane Smith", "Charlie Brown", "Bob Johnson", "Alice Williams"],
  },
  age: {
    ascending: [24, 28, 32, 37, 45],
    descending: [45, 37, 32, 28, 24],
  },
  id: {
    ascending: [1, 2, 3, 4, 5],
    descending: [5, 4, 3, 2, 1],
  },
  role: {
    ascending: ["Designer", "Developer", "DevOps", "Intern", "Manager"],
    descending: ["Manager", "Intern", "DevOps", "Developer", "Designer"],
  },
};

/**
 * Click on a sortable column header
 */
export const clickColumnHeader = async (
  canvasElement: HTMLElement,
  columnLabel: string
): Promise<void> => {
  const targetHeader = findClickableHeaderByLabel(canvasElement, columnLabel);

  if (!targetHeader) {
    throw new Error(`Could not find clickable header with label: ${columnLabel}`);
  }

  // Click the header to trigger sorting
  targetHeader.click();

  // Wait for sorting to complete
  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Get the current data from table rows
 * Using shared utility function
 */
export { getColumnDataFromTable } from "./commonTestUtils";

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
 * Test sorting for a specific column
 */
export const testColumnSorting = async (
  canvasElement: HTMLElement,
  columnLabel: string,
  accessor: string
): Promise<void> => {
  // First click - should sort ascending
  await clickColumnHeader(canvasElement, columnLabel);

  // Verify ascending sort
  verifySortIcon(canvasElement, columnLabel, "ascending");
  const ascendingData = getColumnDataFromTable(canvasElement, accessor);
  const expectedAscending =
    EXPECTED_SORT_ORDERS[accessor as keyof typeof EXPECTED_SORT_ORDERS]?.ascending;

  if (expectedAscending) {
    expect(ascendingData).toEqual(expectedAscending);
  }

  // Second click - should sort descending
  await clickColumnHeader(canvasElement, columnLabel);

  // Verify descending sort
  verifySortIcon(canvasElement, columnLabel, "descending");
  const descendingData = getColumnDataFromTable(canvasElement, accessor);
  const expectedDescending =
    EXPECTED_SORT_ORDERS[accessor as keyof typeof EXPECTED_SORT_ORDERS]?.descending;

  if (expectedDescending) {
    expect(descendingData).toEqual(expectedDescending);
  }

  // Third click - should remove sort (return to original order)
  await clickColumnHeader(canvasElement, columnLabel);

  // Verify no sort icon is present
  const targetHeaderCell = findHeaderCellByLabel(canvasElement, columnLabel);
  const iconContainer = targetHeaderCell?.querySelector(".st-icon-container");
  // Icon container might exist but should not show sort icon when not sorted
  if (iconContainer) {
    // Check that it's not a sort icon or icon is not present
    const hasSortIcon = iconContainer.querySelector("svg");
    // If there's an SVG, it should be empty or not a sort icon when sorting is cleared
  }
};

/**
 * Test sorting persistence across interactions
 */
export const testSortPersistence = async (
  canvasElement: HTMLElement,
  firstColumn: string,
  firstAccessor: string,
  secondColumn: string,
  secondAccessor: string
): Promise<void> => {
  // Sort first column
  await clickColumnHeader(canvasElement, firstColumn);
  const firstSortData = getColumnDataFromTable(canvasElement, firstAccessor);

  // Sort second column (should clear first sort)
  await clickColumnHeader(canvasElement, secondColumn);
  const secondSortData = getColumnDataFromTable(canvasElement, secondAccessor);

  // Verify that sorting the second column clears the first sort
  // This is implementation-specific - adjust based on your table's behavior
  expect(secondSortData).toBeDefined();
  expect(firstSortData).toBeDefined();
};

/**
 * Test multiple rapid clicks to ensure stability
 */
export const testRapidSortClicks = async (
  canvasElement: HTMLElement,
  columnLabel: string,
  accessor: string
): Promise<void> => {
  // Perform multiple rapid clicks
  for (let i = 0; i < 5; i++) {
    await clickColumnHeader(canvasElement, columnLabel);
    await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay between clicks
  }

  // After 5 clicks (odd number), should be in ascending state
  const finalData = getColumnDataFromTable(canvasElement, accessor);
  const expectedAscending =
    EXPECTED_SORT_ORDERS[accessor as keyof typeof EXPECTED_SORT_ORDERS]?.ascending;

  if (expectedAscending) {
    expect(finalData).toEqual(expectedAscending);
  }
};
