import { expect, within } from "@storybook/test";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";
import { HEADERS as BILLING_HEADERS } from "../examples/billing-example/billing-headers";

const EXPECTED_WIDTH_DELTA = 1;

/**
 * Shared test utilities for SimpleTable components
 */

/**
 * Basic table structure validation - checks all essential DOM elements
 */
export const validateBasicTableStructure = async (canvasElement: HTMLElement) => {
  await waitForTable();

  // Core table structure
  const tableRoot = canvasElement.querySelector(".simple-table-root");
  expect(tableRoot).toBeInTheDocument();

  const tableContent = canvasElement.querySelector(".st-content");
  expect(tableContent).toBeInTheDocument();

  const headerContainer = canvasElement.querySelector(".st-header-container");
  expect(headerContainer).toBeInTheDocument();

  const bodyContainer = canvasElement.querySelector(".st-body-container");
  expect(bodyContainer).toBeInTheDocument();

  // At least one row should exist
  const rows = canvasElement.querySelectorAll(".st-row");
  expect(rows.length).toBeGreaterThan(0);

  // Header and body main sections
  const headerMain = headerContainer?.querySelector(".st-header-main");
  expect(headerMain).toBeInTheDocument();

  const bodyMain = bodyContainer?.querySelector(".st-body-main");
  expect(bodyMain).toBeInTheDocument();

  // Horizontal scrollbar validation
  const scrollbarMiddle = canvasElement.querySelector(".st-horizontal-scrollbar-middle");
  expect(scrollbarMiddle).toBeInTheDocument();

  // Check that scrollbar middle has a child div
  const scrollbarChildDiv = scrollbarMiddle?.querySelector("div");
  expect(scrollbarChildDiv).toBeInTheDocument();

  // Validate that the child div width matches the main section width
  if (headerMain && scrollbarChildDiv) {
    const headerMainGridColumns = (headerMain as HTMLElement).style.gridTemplateColumns;
    expect(headerMainGridColumns).toBeTruthy();

    // Calculate main section width from grid columns
    const mainSectionColumnWidths = extractGridColumnWidths(headerMainGridColumns);
    const expectedMainSectionWidth = calculateTotalWidth(mainSectionColumnWidths);

    // Get the scrollbar child div width
    const scrollbarChildWidth = getElementWidth(scrollbarChildDiv);

    expect(expectedMainSectionWidth).toBeGreaterThan(0);
    expect(scrollbarChildWidth).toBe(expectedMainSectionWidth);
  }

  // Validate width consistency across all sections
  await validateAllSectionWidthConsistency(canvasElement);
};

/**
 * Wait for table to be ready for testing with optional timeout
 */
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

/**
 * Test the three-section layout structure (for pinning)
 */
export const testThreeSectionLayout = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await validateBasicTableStructure(canvasElement);

  // Additional pinning-specific checks
  const bodyContainer = canvasElement.querySelector(".st-body-container");

  // Check that both containers exist (already validated above)
  // Check that body has proper layout structure
  const bodyMain = bodyContainer?.querySelector(".st-body-main");
  expect(bodyMain).toBeInTheDocument();
};

/**
 * Column utility functions - RETAIL DATA (legacy)
 */

// Get column accessor by label from RETAIL_SALES_HEADERS
export const getColumnAccessorByLabel = (label: string): string => {
  const header = RETAIL_SALES_HEADERS.find((h) => h.label === label);
  return header?.accessor || label.toLowerCase().replace(/\s+/g, "");
};

// Get column label by accessor from RETAIL_SALES_HEADERS
export const getColumnLabelByAccessor = (accessor: string): string => {
  const header = RETAIL_SALES_HEADERS.find((h) => h.accessor === accessor);
  return header?.label || accessor;
};

// Get columns by pinning status
export const getMainColumns = () => RETAIL_SALES_HEADERS.filter((h) => !h.pinned);
export const getPinnedLeftColumns = () => RETAIL_SALES_HEADERS.filter((h) => h.pinned === "left");
export const getPinnedRightColumns = () => RETAIL_SALES_HEADERS.filter((h) => h.pinned === "right");

// Get column labels by section
export const getMainColumnLabels = (): string[] => {
  return getMainColumns().map((col) => col.label);
};

export const getPinnedLeftColumnLabels = (): string[] => {
  return getPinnedLeftColumns().map((col) => col.label);
};

export const getPinnedRightColumnLabels = (): string[] => {
  return getPinnedRightColumns().map((col) => col.label);
};

/**
 * Column utility functions - BILLING DATA
 */

// Flatten billing headers to get all columns (including nested children)
const flattenBillingHeaders = (headers = BILLING_HEADERS): any[] => {
  const flattened: any[] = [];

  headers.forEach((header) => {
    if (header.children && header.children.length > 0) {
      // For parent headers with children, add the children instead
      header.children.forEach((child) => {
        flattened.push({
          ...child,
          parentLabel: header.label,
          pinned: header.pinned,
        });
      });
    } else {
      // For headers without children, add the header itself
      flattened.push(header);
    }
  });

  return flattened;
};

// Get column accessor by label from BILLING_HEADERS
export const getBillingColumnAccessorByLabel = (label: string): string => {
  const flatHeaders = flattenBillingHeaders();
  const header = flatHeaders.find((h) => h.label === label);
  return header?.accessor || label.toLowerCase().replace(/\s+/g, "");
};

// Get billing columns by pinning status
export const getBillingMainColumns = () => {
  const flatHeaders = flattenBillingHeaders();
  return flatHeaders.filter((h) => !h.pinned);
};

export const getBillingPinnedLeftColumns = () => {
  const flatHeaders = flattenBillingHeaders();
  return flatHeaders.filter((h) => h.pinned === "left");
};

export const getBillingPinnedRightColumns = () => {
  const flatHeaders = flattenBillingHeaders();
  return flatHeaders.filter((h) => h.pinned === "right");
};

// Get billing column labels by section
export const getBillingMainColumnLabels = (): string[] => {
  return getBillingMainColumns().map((col) => col.label);
};

export const getBillingPinnedLeftColumnLabels = (): string[] => {
  return getBillingPinnedLeftColumns().map((col) => col.label);
};

export const getBillingPinnedRightColumnLabels = (): string[] => {
  return getBillingPinnedRightColumns().map((col) => col.label);
};

// Get all billing column labels (useful for comprehensive tests)
export const getAllBillingColumnLabels = (): string[] => {
  const flatHeaders = flattenBillingHeaders();
  return flatHeaders.map((col) => col.label);
};

// Get sortable billing column labels
export const getSortableBillingColumnLabels = (): string[] => {
  const flatHeaders = flattenBillingHeaders();
  return flatHeaders.filter((col) => col.isSortable).map((col) => col.label);
};

/**
 * Column visibility utilities
 */

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

// Check if a column is currently visible in the table
export const isColumnVisible = (canvasElement: HTMLElement, columnAccessor: string): boolean => {
  // Check if column appears in the visible labels (most reliable method)
  const visibleLabels = getVisibleColumnLabels(canvasElement);
  const header = RETAIL_SALES_HEADERS.find((h) => h.accessor === columnAccessor);
  return header ? visibleLabels.includes(header.label) : false;
};

// Check if a billing column is currently visible in the table
export const isBillingColumnVisible = (
  canvasElement: HTMLElement,
  columnAccessor: string
): boolean => {
  const visibleLabels = getVisibleColumnLabels(canvasElement);
  const flatHeaders = flattenBillingHeaders();
  const header = flatHeaders.find((h) => h.accessor === columnAccessor);
  return header ? visibleLabels.includes(header.label) : false;
};

/**
 * Column reordering utilities
 */

// Get column order from a specific section
export const getColumnOrderFromSection = (section: Element): string[] => {
  return Array.from(section.querySelectorAll(".st-header-label-text")).map(
    (el) => el.textContent || ""
  );
};

/**
 * Find a header element by its label text
 * This is a common pattern used across multiple test files
 */
export const findHeaderElementByLabel = (
  canvasElement: HTMLElement,
  columnLabel: string
): HTMLElement | null => {
  const headerElements = canvasElement.querySelectorAll(".st-header-label-text");

  for (const element of Array.from(headerElements)) {
    if (element.textContent?.trim() === columnLabel) {
      return element as HTMLElement;
    }
  }

  return null;
};

/**
 * Find a header cell by its label text
 * Returns the closest .st-header-cell element
 */
export const findHeaderCellByLabel = (
  canvasElement: HTMLElement,
  columnLabel: string
): HTMLElement | null => {
  const headerElement = findHeaderElementByLabel(canvasElement, columnLabel);
  return headerElement ? (headerElement.closest(".st-header-cell") as HTMLElement) : null;
};

/**
 * Find a clickable header by its label text
 * Returns the header element if it's inside a clickable header cell
 */
export const findClickableHeaderByLabel = (
  canvasElement: HTMLElement,
  columnLabel: string
): HTMLElement | null => {
  const headerElements = canvasElement.querySelectorAll(".st-header-label-text");

  for (const element of Array.from(headerElements)) {
    if (element.textContent?.trim() === columnLabel) {
      const headerCell = element.closest(".st-header-cell.clickable");
      if (headerCell) {
        return element.closest(".st-header-label") as HTMLElement;
      }
    }
  }

  return null;
};

/**
 * Get column data from table rows by accessor
 * Common pattern for extracting cell values
 */
export const getColumnDataFromTable = (
  canvasElement: HTMLElement,
  accessor: string
): (string | number)[] => {
  const values: (string | number)[] = [];
  const cells = canvasElement.querySelectorAll(`[data-accessor="${accessor}"] .st-cell-content`);

  Array.from(cells).forEach((cell) => {
    const text = cell.textContent?.trim() || "";
    // Try to parse as number for numeric columns
    const numValue = parseFloat(text);
    values.push(isNaN(numValue) ? text : numValue);
  });

  return values;
};

/**
 * Width validation utilities for ensuring header and body sections match
 */

/**
 * Extract grid column widths from grid-template-columns style
 */
export const extractGridColumnWidths = (gridTemplateColumns: string): number[] => {
  if (!gridTemplateColumns || gridTemplateColumns === "none") {
    return [];
  }

  // Extract pixel values from grid-template-columns (e.g., "250px 150px" -> [250, 150])
  const matches = gridTemplateColumns.match(/(\d+(?:\.\d+)?)px/g);
  return matches ? matches.map((match) => parseFloat(match.replace("px", ""))) : [];
};

/**
 * Calculate total width from grid column widths
 */
export const calculateTotalWidth = (gridColumnWidths: number[]): number => {
  return gridColumnWidths.reduce((sum, width) => sum + width, 0);
};

/**
 * Get computed width of an element, trying multiple methods
 */
export const getElementWidth = (element: Element): number => {
  // First try to get from style attribute width
  const styleWidth = (element as HTMLElement).style.width;
  if (styleWidth && styleWidth.includes("px")) {
    return parseFloat(styleWidth.replace("px", ""));
  }

  // Then try grid-template-columns
  const gridColumns = (element as HTMLElement).style.gridTemplateColumns;
  if (gridColumns) {
    const columnWidths = extractGridColumnWidths(gridColumns);
    if (columnWidths.length > 0) {
      return calculateTotalWidth(columnWidths);
    }
  }

  // Fallback to computed style
  const computedStyle = window.getComputedStyle(element);
  const computedWidth = computedStyle.width;
  if (computedWidth && computedWidth !== "auto") {
    return parseFloat(computedWidth.replace("px", ""));
  }

  return 0;
};

/**
 * Validate left pinned section width consistency
 */
export const validateLeftPinnedWidthConsistency = async (canvasElement: HTMLElement) => {
  const headerPinnedLeft = canvasElement.querySelector(".st-header-pinned-left");
  const bodyPinnedLeft = canvasElement.querySelector(".st-body-pinned-left");

  if (!headerPinnedLeft || !bodyPinnedLeft) {
    // If either section doesn't exist, there's nothing to validate
    return;
  }

  const headerWidth = getElementWidth(headerPinnedLeft);
  const bodyWidth = getElementWidth(bodyPinnedLeft);

  expect(headerWidth).toBeGreaterThan(0);
  expect(bodyWidth).toBeGreaterThan(0);
  expect(headerWidth + EXPECTED_WIDTH_DELTA).toBe(bodyWidth);

  // Also validate that individual rows match the header grid
  const headerGridColumns = (headerPinnedLeft as HTMLElement).style.gridTemplateColumns;
  const bodyRows = bodyPinnedLeft.querySelectorAll(".st-row");

  if (bodyRows.length > 0) {
    const firstRowGridColumns = (bodyRows[0] as HTMLElement).style.gridTemplateColumns;
    expect(firstRowGridColumns).toBe(headerGridColumns);
  }
};

/**
 * Validate main section width consistency
 */
export const validateMainSectionWidthConsistency = async (canvasElement: HTMLElement) => {
  const headerMain = canvasElement.querySelector(".st-header-main");
  const bodyMain = canvasElement.querySelector(".st-body-main");

  expect(headerMain).toBeInTheDocument();
  expect(bodyMain).toBeInTheDocument();

  const headerWidth = getElementWidth(headerMain!);

  // For main section, we need to check the grid columns since body-main might not have explicit width
  const headerGridColumns = (headerMain as HTMLElement).style.gridTemplateColumns;
  expect(headerGridColumns).toBeTruthy();

  // Validate that body rows match the header grid
  const bodyRows = bodyMain!.querySelectorAll(".st-row");
  expect(bodyRows.length).toBeGreaterThan(0);

  const firstRowGridColumns = (bodyRows[0] as HTMLElement).style.gridTemplateColumns;

  expect(firstRowGridColumns).toBe(headerGridColumns);

  // Calculate expected width from grid columns
  const headerColumnWidths = extractGridColumnWidths(headerGridColumns);
  const expectedWidth = calculateTotalWidth(headerColumnWidths);
  expect(expectedWidth).toBeGreaterThan(0);
  expect(headerWidth).toBe(expectedWidth);
};

/**
 * Validate right pinned section width consistency
 */
export const validateRightPinnedWidthConsistency = async (canvasElement: HTMLElement) => {
  const headerPinnedRight = canvasElement.querySelector(".st-header-pinned-right");
  const bodyPinnedRight = canvasElement.querySelector(".st-body-pinned-right");

  if (!headerPinnedRight || !bodyPinnedRight) {
    // If either section doesn't exist, there's nothing to validate
    return;
  }

  const headerWidth = getElementWidth(headerPinnedRight);
  const bodyWidth = getElementWidth(bodyPinnedRight);

  expect(headerWidth).toBeGreaterThan(0);
  expect(bodyWidth).toBeGreaterThan(0);
  expect(headerWidth + EXPECTED_WIDTH_DELTA).toBe(bodyWidth);

  // Also validate that individual rows match the header grid
  const headerGridColumns = (headerPinnedRight as HTMLElement).style.gridTemplateColumns;
  const bodyRows = bodyPinnedRight.querySelectorAll(".st-row");

  if (bodyRows.length > 0) {
    const firstRowGridColumns = (bodyRows[0] as HTMLElement).style.gridTemplateColumns;
    expect(firstRowGridColumns).toBe(headerGridColumns);
  }
};

/**
 * Comprehensive width validation for all table sections
 */
export const validateAllSectionWidthConsistency = async (canvasElement: HTMLElement) => {
  await validateLeftPinnedWidthConsistency(canvasElement);
  await validateMainSectionWidthConsistency(canvasElement);
  await validateRightPinnedWidthConsistency(canvasElement);
};

/**
 * Enhanced basic table structure validation with width consistency
 */
export const validateEnhancedBasicTableStructure = async (canvasElement: HTMLElement) => {
  // First validate the basic structure
  await validateBasicTableStructure(canvasElement);

  // Then validate width consistency across all sections
  await validateAllSectionWidthConsistency(canvasElement);
};
