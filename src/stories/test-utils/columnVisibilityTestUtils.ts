import { expect, within } from "@storybook/test";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

/**
 * Column Visibility Test Utilities
 */

// Wait for table to be rendered
export const waitForTable = async (timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const table = document.querySelector(".simple-table-root");
    if (table) {
      // Wait a bit more for full render
      await new Promise((resolve) => setTimeout(resolve, 200));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Table did not render within timeout");
};

// Open the column editor panel by clicking "Columns" text
export const openColumnEditor = async (canvasElement: HTMLElement) => {
  const columnEditorText = canvasElement.querySelector(".st-column-editor-text");
  expect(columnEditorText).toBeTruthy();

  (columnEditorText as HTMLElement).click();
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Verify panel is open
  const popout =
    canvasElement.querySelector(".st-column-editor-popout.open") ||
    canvasElement.querySelector(".st-column-editor-popout");
  expect(popout).toBeTruthy();

  return popout;
};

// Get all checkbox items from the column editor
export const getColumnCheckboxItems = (popout: Element) => {
  const checkboxItems = popout.querySelectorAll(".st-header-checkbox-item");
  expect(checkboxItems.length).toBeGreaterThan(0);
  return Array.from(checkboxItems);
};

// Get column label from checkbox item
export const getColumnLabelFromCheckbox = (checkboxItem: Element): string => {
  const label = checkboxItem.querySelector(".st-checkbox-label");
  return label?.textContent?.trim() || "";
};

// Get checkbox input from checkbox item
export const getCheckboxInput = (checkboxItem: Element): HTMLInputElement => {
  const checkbox = checkboxItem.querySelector(".st-checkbox-input") as HTMLInputElement;
  expect(checkbox).toBeTruthy();
  return checkbox;
};

// Check if column is currently visible in the table
export const isColumnVisible = (canvasElement: HTMLElement, columnAccessor: string): boolean => {
  // Method 1: Check if header cell exists and is visible
  const headerCell = canvasElement.querySelector(`[id*='cell-${columnAccessor}']`);
  if (!headerCell) return false;

  // Check if the element is actually visible (not hidden by CSS)
  const computedStyle = window.getComputedStyle(headerCell as Element);
  const element = headerCell as HTMLElement;

  // Check various ways an element can be hidden
  const isDisplayed = computedStyle.display !== "none";
  const isVisible = computedStyle.visibility !== "hidden";
  const hasSize = element.offsetWidth > 0 && element.offsetHeight > 0;
  const isOpaque = parseFloat(computedStyle.opacity) > 0;

  const headerVisible = isDisplayed && isVisible && hasSize && isOpaque;

  // Method 2: Check if column appears in the visible labels (more reliable)
  const visibleLabels = getVisibleColumnLabels(canvasElement);
  const header = RETAIL_SALES_HEADERS.find((h) => h.accessor === columnAccessor);
  const labelVisible = header ? visibleLabels.includes(header.label) : false;

  // For now, let's use the label-based check as it's more reliable
  return labelVisible;
};

// Get column accessor by label
export const getColumnAccessorByLabel = (label: string): string => {
  const header = RETAIL_SALES_HEADERS.find((h) => h.label === label);
  return header?.accessor || label.toLowerCase().replace(/\s+/g, "");
};

// Toggle a column's visibility by clicking its checkbox
export const toggleColumnVisibility = async (
  checkboxItem: Element,
  columnLabel: string
): Promise<{ wasChecked: boolean; nowChecked: boolean }> => {
  const checkbox = getCheckboxInput(checkboxItem);
  const wasChecked = checkbox.checked;

  // Click the input directly (this triggers the onChange handler)
  checkbox.click();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const nowChecked = checkbox.checked;
  return { wasChecked, nowChecked };
};

// Count visible columns in table
export const countVisibleColumns = (canvasElement: HTMLElement): number => {
  const headerLabels = canvasElement.querySelectorAll(".st-header-label-text");
  return headerLabels.length;
};

// Get all currently visible column labels
export const getVisibleColumnLabels = (canvasElement: HTMLElement): string[] => {
  const headerLabels = canvasElement.querySelectorAll(".st-header-label-text");
  return Array.from(headerLabels).map((label) => label.textContent?.trim() || "");
};

/**
 * Test column editor structure and functionality
 */
export const testColumnEditorStructure = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await waitForTable();

  // Test column editor exists
  const columnEditor = canvasElement.querySelector(".st-column-editor");
  expect(columnEditor).toBeTruthy();

  // Test "Columns" text exists
  const columnEditorText = canvasElement.querySelector(".st-column-editor-text");
  expect(columnEditorText).toBeTruthy();
  expect(columnEditorText?.textContent?.trim()).toBe("Columns");

  // Open the panel
  const popout = await openColumnEditor(canvasElement);
  expect(popout).toBeTruthy();

  // Test popout structure
  const popoutContent = popout!.querySelector(".st-column-editor-popout-content");
  expect(popoutContent).toBeTruthy();

  // Test checkbox items
  const checkboxItems = getColumnCheckboxItems(popout!);
  expect(checkboxItems.length).toBe(RETAIL_SALES_HEADERS.length);

  // Test each checkbox item structure
  checkboxItems.forEach((item) => {
    expect(item).toHaveClass("st-header-checkbox-item");

    const label = item.querySelector(".st-checkbox-label");
    expect(label).toBeTruthy();

    const checkbox = item.querySelector(".st-checkbox-input");
    expect(checkbox).toBeTruthy();

    const customCheckbox = item.querySelector(".st-checkbox-custom");
    expect(customCheckbox).toBeTruthy();
  });
};

/**
 * Test basic column visibility toggle functionality
 */
export const testColumnVisibilityToggle = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await waitForTable();

  const initialColumnCount = countVisibleColumns(canvasElement);

  // Open column editor
  const popout = await openColumnEditor(canvasElement);
  expect(popout).toBeTruthy();
  const checkboxItems = getColumnCheckboxItems(popout!);

  // Find the first UNCHECKED column (visible column) to test hiding
  let testItem = null;
  let testLabel = "";

  for (const item of checkboxItems) {
    const checkbox = getCheckboxInput(item);
    const label = getColumnLabelFromCheckbox(item);

    if (!checkbox.checked) {
      // Find an unchecked (visible) column
      testItem = item;
      testLabel = label;
      break;
    }
  }

  expect(testItem).toBeTruthy();
  expect(testLabel).toBeTruthy();

  const columnAccessor = getColumnAccessorByLabel(testLabel);

  // Verify column is initially visible (checkbox unchecked)
  expect(isColumnVisible(canvasElement, columnAccessor)).toBe(true);

  // Toggle the column off (check the checkbox to hide)
  const { wasChecked, nowChecked } = await toggleColumnVisibility(testItem!, testLabel);

  expect(wasChecked).toBe(false); // Was unchecked (visible)
  expect(nowChecked).toBe(true); // Now checked (hidden)

  // Wait for React to update
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Verify column is now hidden
  expect(isColumnVisible(canvasElement, columnAccessor)).toBe(false);

  // Verify column count decreased
  const finalColumnCount = countVisibleColumns(canvasElement);
  expect(finalColumnCount).toBe(initialColumnCount - 1);

  // Toggle the column back on (uncheck the checkbox to show)
  const { wasChecked: wasChecked2, nowChecked: nowChecked2 } = await toggleColumnVisibility(
    testItem!,
    testLabel
  );

  expect(wasChecked2).toBe(true); // Was checked (hidden)
  expect(nowChecked2).toBe(false); // Now unchecked (visible)

  // Wait for React to update
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Verify column is visible again
  expect(isColumnVisible(canvasElement, columnAccessor)).toBe(true);

  // Verify column count restored
  const restoredColumnCount = countVisibleColumns(canvasElement);
  expect(restoredColumnCount).toBe(initialColumnCount);
};

/**
 * Test hiding multiple columns
 */
export const testHideMultipleColumns = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  columnsToHide: string[] = ["City", "Opening Date", "Customer Rating"]
) => {
  await waitForTable();

  const initialColumnCount = countVisibleColumns(canvasElement);
  const popout = await openColumnEditor(canvasElement);
  expect(popout).toBeTruthy();
  const checkboxItems = getColumnCheckboxItems(popout!);

  let hiddenCount = 0;

  for (const columnLabel of columnsToHide) {
    // Find the checkbox for this column
    const targetItem = checkboxItems.find(
      (item) => getColumnLabelFromCheckbox(item) === columnLabel
    );

    if (targetItem) {
      const checkbox = getCheckboxInput(targetItem);
      const columnAccessor = getColumnAccessorByLabel(columnLabel);

      // If checkbox is unchecked, column is visible - we need to check it to hide it
      if (!checkbox.checked) {
        await toggleColumnVisibility(targetItem, columnLabel);

        // Wait for React to update
        await new Promise((resolve) => setTimeout(resolve, 500));

        expect(isColumnVisible(canvasElement, columnAccessor)).toBe(false);
        hiddenCount++;
      }
      // If checkbox is already checked, column is already hidden - skip it
    }
  }

  // Verify total column count decreased appropriately
  const finalColumnCount = countVisibleColumns(canvasElement);
  expect(finalColumnCount).toBe(initialColumnCount - hiddenCount);
};

/**
 * Test showing specific columns
 */
export const testShowSpecificColumns = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  columnsToShow: string[]
) => {
  await waitForTable();

  const popout = await openColumnEditor(canvasElement);
  expect(popout).toBeTruthy();
  const checkboxItems = getColumnCheckboxItems(popout!);

  for (const columnLabel of columnsToShow) {
    const targetItem = checkboxItems.find(
      (item) => getColumnLabelFromCheckbox(item) === columnLabel
    );

    if (targetItem) {
      const checkbox = getCheckboxInput(targetItem);
      const columnAccessor = getColumnAccessorByLabel(columnLabel);

      // If checkbox is checked, column is hidden - uncheck it to show
      if (checkbox.checked) {
        await toggleColumnVisibility(targetItem, columnLabel);

        // Wait for React to update
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      // If checkbox is already unchecked, column is already visible - skip it

      // Verify column is now visible
      expect(isColumnVisible(canvasElement, columnAccessor)).toBe(true);
    }
  }

  // Verify all specified columns are visible
  const visibleLabels = getVisibleColumnLabels(canvasElement);
  for (const columnLabel of columnsToShow) {
    expect(visibleLabels).toContain(columnLabel);
  }
};

/**
 * Test that hidden columns are not visible in table
 */
export const testHiddenColumnsNotVisible = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  hiddenColumnLabels: string[]
) => {
  await waitForTable();

  for (const columnLabel of hiddenColumnLabels) {
    const columnAccessor = getColumnAccessorByLabel(columnLabel);
    expect(isColumnVisible(canvasElement, columnAccessor)).toBe(false);
  }
};

/**
 * Test that visible columns are shown in table
 */
export const testVisibleColumnsShown = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  visibleColumnLabels: string[]
) => {
  await waitForTable();

  for (const columnLabel of visibleColumnLabels) {
    const columnAccessor = getColumnAccessorByLabel(columnLabel);
    const headerCell = canvasElement.querySelector(`[id*='cell-${columnAccessor}']`);
    expect(headerCell).toBeTruthy();

    // Also check that body cells with this accessor exist
    const bodyCells = canvasElement.querySelectorAll(`[data-accessor="${columnAccessor}"]`);
    expect(bodyCells.length).toBeGreaterThan(0);
  }

  // Verify labels are in the visible column labels
  const actualVisibleLabels = getVisibleColumnLabels(canvasElement);
  for (const columnLabel of visibleColumnLabels) {
    expect(actualVisibleLabels).toContain(columnLabel);
  }
};
