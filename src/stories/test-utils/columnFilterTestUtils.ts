import { expect } from "@storybook/test";
import { findHeaderCellByLabel, getColumnDataFromTable } from "./commonTestUtils";

/**
 * Filter test configurations for different column types
 */
export const FILTER_TEST_CONFIGURATIONS = {
  string: {
    accessor: "productName",
    label: "Product",
    type: "string",
    testValue: "iPhone",
    expectedResults: ["iPhone 15 Pro Max", "iPhone 14"],
  },
  enum: {
    accessor: "category",
    label: "Category",
    type: "enum",
    testValue: "Electronics",
    expectedResults: ["Electronics"],
  },
  number: {
    accessor: "price",
    label: "Price",
    type: "number",
    testValue: 1000,
    operator: "greater than",
  },
  boolean: {
    accessor: "isActive",
    label: "Status",
    type: "boolean",
    testValue: true,
  },
  date: {
    accessor: "releaseDate",
    label: "Release Date",
    type: "date",
    testValue: "2024-01-01",
    operator: "after",
  },
};

/**
 * Click on a filter icon to open filter dropdown
 */
export const clickFilterIcon = async (
  canvasElement: HTMLElement,
  columnLabel: string
): Promise<void> => {
  console.log(`🔄 Clicking filter icon for column: ${columnLabel}`);

  const targetHeaderCell = findHeaderCellByLabel(canvasElement, columnLabel);

  if (!targetHeaderCell) {
    throw new Error(`Could not find header with label: ${columnLabel}`);
  }

  // Find the filter icon within this header cell
  const filterIcon = targetHeaderCell.querySelector(
    ".st-icon-container svg[viewBox='0 0 512 512']"
  );

  if (!filterIcon) {
    throw new Error(`Could not find filter icon for column: ${columnLabel}`);
  }

  // Click the filter icon
  (filterIcon.parentElement as HTMLElement).click();

  // Wait for dropdown to open
  await new Promise((resolve) => setTimeout(resolve, 200));
};

/**
 * Wait for filter dropdown to be visible
 */
export const waitForFilterDropdown = async (canvasElement: HTMLElement): Promise<HTMLElement> => {
  let dropdown: HTMLElement | null = null;
  let attempts = 0;
  const maxAttempts = 10;

  while (!dropdown && attempts < maxAttempts) {
    dropdown = canvasElement.querySelector(
      ".st-dropdown-content .st-filter-container"
    ) as HTMLElement;
    if (!dropdown) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
  }

  if (!dropdown) {
    throw new Error("Filter dropdown did not appear");
  }

  return dropdown;
};

/**
 * Fill in string filter input
 */
export const fillStringFilter = async (dropdown: HTMLElement, value: string): Promise<void> => {
  const input = dropdown.querySelector(".st-filter-input") as HTMLInputElement;
  if (!input) {
    throw new Error("Could not find filter input");
  }

  // Clear and fill input
  input.value = "";
  input.focus();
  input.value = value;

  // Trigger input event
  input.dispatchEvent(new Event("input", { bubbles: true }));

  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Select operator from dropdown
 */
export const selectOperator = async (dropdown: HTMLElement, operator: string): Promise<void> => {
  const operatorButton = dropdown.querySelector(".st-custom-select-trigger") as HTMLElement;
  if (!operatorButton) {
    throw new Error("Could not find operator selector");
  }

  // Click to open operator dropdown
  operatorButton.click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Find and click the desired operator option
  const options = dropdown.querySelectorAll(".st-custom-select-option");
  for (const option of Array.from(options)) {
    if (option.textContent?.trim().toLowerCase().includes(operator.toLowerCase())) {
      (option as HTMLElement).click();
      break;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Fill number filter input
 */
export const fillNumberFilter = async (
  dropdown: HTMLElement,
  value: number,
  operator: string = "equals"
): Promise<void> => {
  // Select operator first
  await selectOperator(dropdown, operator);

  const input = dropdown.querySelector(".st-filter-input[type='number']") as HTMLInputElement;
  if (!input) {
    throw new Error("Could not find number filter input");
  }

  // Clear and fill input
  input.value = "";
  input.focus();
  input.value = value.toString();

  // Trigger input event
  input.dispatchEvent(new Event("input", { bubbles: true }));

  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Select boolean filter value
 */
export const selectBooleanFilter = async (dropdown: HTMLElement, value: boolean): Promise<void> => {
  const selectButton = dropdown.querySelector(".st-custom-select-trigger") as HTMLElement;
  if (!selectButton) {
    throw new Error("Could not find boolean selector");
  }

  // Click to open dropdown
  selectButton.click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Find and click the appropriate option
  const options = dropdown.querySelectorAll(".st-custom-select-option");
  for (const option of Array.from(options)) {
    const text = option.textContent?.trim().toLowerCase();
    if ((value && text === "true") || (!value && text === "false")) {
      (option as HTMLElement).click();
      break;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Select enum filter values
 */
export const selectEnumFilter = async (dropdown: HTMLElement, values: string[]): Promise<void> => {
  // Find all checkboxes in the enum filter
  const checkboxes = dropdown.querySelectorAll(".st-checkbox-input");

  for (const value of values) {
    for (const checkbox of Array.from(checkboxes)) {
      const label = checkbox.parentElement?.textContent?.trim();
      if (label === value) {
        if (!(checkbox as HTMLInputElement).checked) {
          (checkbox as HTMLElement).click();
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        break;
      }
    }
  }
};

/**
 * Fill date filter input
 */
export const fillDateFilter = async (
  dropdown: HTMLElement,
  value: string,
  operator: string = "equals"
): Promise<void> => {
  // Select operator first
  await selectOperator(dropdown, operator);

  const input = dropdown.querySelector(".st-filter-input") as HTMLInputElement;
  if (!input) {
    throw new Error("Could not find date filter input");
  }

  // Click to open date picker
  input.click();
  await new Promise((resolve) => setTimeout(resolve, 200));

  // For simplicity, directly set the value
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));

  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Click apply filter button
 */
export const applyFilter = async (dropdown: HTMLElement): Promise<void> => {
  const applyButton = dropdown.querySelector(
    ".st-filter-button-apply:not(.st-filter-button-disabled)"
  ) as HTMLElement;
  if (!applyButton) {
    throw new Error("Apply button is not available or disabled");
  }

  applyButton.click();

  // Wait for filter to be applied
  await new Promise((resolve) => setTimeout(resolve, 300));
};

/**
 * Click clear filter button
 */
export const clearFilter = async (dropdown: HTMLElement): Promise<void> => {
  const clearButton = dropdown.querySelector(".st-filter-button-clear") as HTMLElement;
  if (!clearButton) {
    throw new Error("Clear button not found");
  }

  clearButton.click();

  // Wait for filter to be cleared
  await new Promise((resolve) => setTimeout(resolve, 300));
};

/**
 * Get filtered table data - using shared utility
 */
export const getFilteredTableData = (canvasElement: HTMLElement, accessor: string): string[] => {
  return getColumnDataFromTable(canvasElement, accessor).map((value) => value.toString());
};

/**
 * Count visible table rows
 */
export const countVisibleRows = (canvasElement: HTMLElement): number => {
  const rows = canvasElement.querySelectorAll(".st-row");
  return rows.length;
};

/**
 * Test string filter functionality
 */
export const testStringFilter = async (
  canvasElement: HTMLElement,
  columnLabel: string,
  accessor: string,
  filterValue: string,
  expectedResults?: string[]
): Promise<void> => {
  console.log(`🔄 Testing string filter for ${columnLabel} with value: ${filterValue}`);

  // Get initial row count
  const initialRowCount = countVisibleRows(canvasElement);

  // Open filter dropdown
  await clickFilterIcon(canvasElement, columnLabel);
  const dropdown = await waitForFilterDropdown(canvasElement);

  // Fill filter value
  await fillStringFilter(dropdown, filterValue);

  // Apply filter
  await applyFilter(dropdown);

  // Verify filter was applied
  const filteredRowCount = countVisibleRows(canvasElement);
  expect(filteredRowCount).toBeLessThan(initialRowCount);

  // Check filtered data if expected results provided
  if (expectedResults) {
    const filteredData = getFilteredTableData(canvasElement, accessor);
    expectedResults.forEach((expected) => {
      expect(filteredData.some((data) => data.includes(expected))).toBe(true);
    });
  }

  console.log(`✅ String filter test passed for ${columnLabel}`);
};

/**
 * Test number filter functionality
 */
export const testNumberFilter = async (
  canvasElement: HTMLElement,
  columnLabel: string,
  operator: string = "greater than",
  value: number = 1000
): Promise<void> => {
  console.log(`🔄 Testing number filter for ${columnLabel} with ${operator} ${value}`);

  const initialRowCount = countVisibleRows(canvasElement);

  // Open filter dropdown
  await clickFilterIcon(canvasElement, columnLabel);
  const dropdown = await waitForFilterDropdown(canvasElement);

  // Fill number filter
  await fillNumberFilter(dropdown, value, operator);

  // Apply filter
  await applyFilter(dropdown);

  // Verify filter was applied
  const filteredRowCount = countVisibleRows(canvasElement);
  expect(filteredRowCount).toBeLessThan(initialRowCount);

  console.log(`✅ Number filter test passed for ${columnLabel}`);
};

/**
 * Test boolean filter functionality
 */
export const testBooleanFilter = async (
  canvasElement: HTMLElement,
  columnLabel: string,
  value: boolean = true
): Promise<void> => {
  console.log(`🔄 Testing boolean filter for ${columnLabel} with value: ${value}`);

  const initialRowCount = countVisibleRows(canvasElement);

  // Open filter dropdown
  await clickFilterIcon(canvasElement, columnLabel);
  const dropdown = await waitForFilterDropdown(canvasElement);

  // Select boolean value
  await selectBooleanFilter(dropdown, value);

  // Apply filter
  await applyFilter(dropdown);

  // Verify filter was applied
  const filteredRowCount = countVisibleRows(canvasElement);
  expect(filteredRowCount).toBeLessThan(initialRowCount);

  console.log(`✅ Boolean filter test passed for ${columnLabel}`);
};

/**
 * Test enum filter functionality
 */
export const testEnumFilter = async (
  canvasElement: HTMLElement,
  columnLabel: string,
  values: string[]
): Promise<void> => {
  console.log(`🔄 Testing enum filter for ${columnLabel} with values: ${values.join(", ")}`);

  const initialRowCount = countVisibleRows(canvasElement);

  // Open filter dropdown
  await clickFilterIcon(canvasElement, columnLabel);
  const dropdown = await waitForFilterDropdown(canvasElement);

  // First uncheck "Select All" if checked
  const selectAllCheckbox = dropdown.querySelector(
    ".st-enum-select-all .st-checkbox-input"
  ) as HTMLInputElement;
  if (selectAllCheckbox?.checked) {
    selectAllCheckbox.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Select specific enum values
  await selectEnumFilter(dropdown, values);

  // Apply filter
  await applyFilter(dropdown);

  // Verify filter was applied
  const filteredRowCount = countVisibleRows(canvasElement);
  expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);

  console.log(`✅ Enum filter test passed for ${columnLabel}`);
};

/**
 * Test filter clear functionality
 */
export const testFilterClear = async (
  canvasElement: HTMLElement,
  columnLabel: string
): Promise<void> => {
  console.log(`🔄 Testing filter clear for ${columnLabel}`);

  // Get row count after filter (should be reduced)
  const filteredRowCount = countVisibleRows(canvasElement);

  // Open filter dropdown
  await clickFilterIcon(canvasElement, columnLabel);
  const dropdown = await waitForFilterDropdown(canvasElement);

  // Clear filter
  await clearFilter(dropdown);

  // Verify filter was cleared
  const clearedRowCount = countVisibleRows(canvasElement);
  expect(clearedRowCount).toBeGreaterThan(filteredRowCount);

  console.log(`✅ Filter clear test passed for ${columnLabel}`);
};
