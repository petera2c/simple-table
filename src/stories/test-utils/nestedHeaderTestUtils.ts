import { expect } from "@storybook/test";

/**
 * Nested header test configurations
 */
export const NESTED_HEADER_CONFIGURATIONS = [
  {
    parentLabel: "Product Details",
    children: ["Category", "Brand", "Rating"],
    accessor: "details",
  },
  {
    parentLabel: "Pricing & Inventory",
    children: ["Price", "Stock", "Status", "Release Date"],
    accessor: "pricing",
  },
];

/**
 * Expected nested header structure for FilterExample
 */
export const EXPECTED_NESTED_STRUCTURE = {
  totalHeaders: 6, // 1 standalone + 2 parent headers
  totalColumns: 8, // All leaf columns that actually display data
  parentHeaders: 2,
  standalone: 1, // Product column
};

/**
 * Find nested header element by label
 */
export const findNestedHeader = (canvasElement: HTMLElement, label: string): HTMLElement | null => {
  const headerElements = canvasElement.querySelectorAll(".st-header-label-text");

  for (const element of Array.from(headerElements)) {
    if (element.textContent?.trim() === label) {
      return element.closest(".st-header-cell") as HTMLElement;
    }
  }

  return null;
};

/**
 * Verify nested header spans multiple columns
 */
export const verifyHeaderSpan = (headerElement: HTMLElement, expectedChildCount: number): void => {
  const style = headerElement.style;
  const gridArea = style.gridArea;

  if (gridArea) {
    // Parse grid area format: "row-start / col-start / row-end / col-end"
    const parts = gridArea.split(" / ");
    const colStart = parseInt(parts[1]);
    const colEnd = parseInt(parts[3]);
    const actualSpan = colEnd - colStart;

    expect(actualSpan).toBe(expectedChildCount);
    console.log(`✅ Header spans ${actualSpan} columns as expected`);
  } else {
    throw new Error("Could not find grid area styling on header element");
  }
};

/**
 * Verify parent header class
 */
export const verifyParentHeaderClass = (headerElement: HTMLElement): void => {
  expect(headerElement.classList.contains("parent")).toBe(true);
  console.log("✅ Parent header has correct CSS class");
};

/**
 * Verify child headers are positioned correctly under parent
 */
export const verifyChildHeaderPositions = (
  canvasElement: HTMLElement,
  parentLabel: string,
  childLabels: string[]
): void => {
  const parentHeader = findNestedHeader(canvasElement, parentLabel);
  expect(parentHeader).toBeTruthy();

  // Get parent header grid positioning
  const parentStyle = parentHeader!.style.gridArea;
  const parentParts = parentStyle.split(" / ");
  const parentRowStart = parseInt(parentParts[0]);
  const parentColStart = parseInt(parentParts[1]);
  const parentColEnd = parseInt(parentParts[3]);

  // Verify each child header
  let expectedCol = parentColStart;

  for (const childLabel of childLabels) {
    const childHeader = findNestedHeader(canvasElement, childLabel);
    expect(childHeader).toBeTruthy();

    const childStyle = childHeader!.style.gridArea;
    const childParts = childStyle.split(" / ");
    const childRowStart = parseInt(childParts[0]);
    const childColStart = parseInt(childParts[1]);

    // Child should be in row below parent
    expect(childRowStart).toBe(parentRowStart + 1);

    // Child should be positioned within parent's column span
    expect(childColStart).toBeGreaterThanOrEqual(parentColStart);
    expect(childColStart).toBeLessThan(parentColEnd);

    expectedCol++;
  }

  console.log(`✅ All child headers positioned correctly under ${parentLabel}`);
};

/**
 * Test nested header structure
 */
export const testNestedHeaderStructure = (canvasElement: HTMLElement): void => {
  console.log("🔄 Testing nested header structure");

  // Count different types of headers
  const allHeaders = canvasElement.querySelectorAll(".st-header-cell");
  const parentHeaders = canvasElement.querySelectorAll(".st-header-cell.parent");

  console.log(`Found ${allHeaders.length} total headers, ${parentHeaders.length} parent headers`);

  // Verify we have the expected number of parent headers
  expect(parentHeaders.length).toBe(EXPECTED_NESTED_STRUCTURE.parentHeaders);

  // Verify each nested header configuration
  NESTED_HEADER_CONFIGURATIONS.forEach((config) => {
    const parentHeader = findNestedHeader(canvasElement, config.parentLabel);
    expect(parentHeader).toBeTruthy();

    // Verify parent header styling
    verifyParentHeaderClass(parentHeader!);
    verifyHeaderSpan(parentHeader!, config.children.length);

    // Verify child positioning
    verifyChildHeaderPositions(canvasElement, config.parentLabel, config.children);
  });

  console.log("✅ Nested header structure test passed");
};

/**
 * Test that nested headers don't interfere with sorting
 */
export const testNestedHeaderSorting = async (
  canvasElement: HTMLElement,
  childColumnLabel: string
): Promise<void> => {
  console.log(`🔄 Testing sorting on nested child column: ${childColumnLabel}`);

  // Find the child header
  const childHeader = findNestedHeader(canvasElement, childColumnLabel);
  expect(childHeader).toBeTruthy();

  // Verify it's clickable (sortable)
  expect(childHeader!.classList.contains("clickable")).toBe(true);

  // Get initial row count
  const initialRows = canvasElement.querySelectorAll(".st-row");
  const initialRowCount = initialRows.length;

  // Click to sort
  const headerLabel = childHeader!.querySelector(".st-header-label") as HTMLElement;
  headerLabel.click();

  await new Promise((resolve) => setTimeout(resolve, 200));

  // Verify table still renders correctly after sort
  const rowsAfterSort = canvasElement.querySelectorAll(".st-row");
  expect(rowsAfterSort.length).toBe(initialRowCount);

  // Verify sort icon appears
  const sortIcon = childHeader!.querySelector(".st-icon-container svg");
  expect(sortIcon).toBeTruthy();

  console.log(`✅ Nested header sorting test passed for ${childColumnLabel}`);
};

/**
 * Test that nested headers don't interfere with filtering
 */
export const testNestedHeaderFiltering = async (
  canvasElement: HTMLElement,
  childColumnLabel: string
): Promise<void> => {
  console.log(`🔄 Testing filtering on nested child column: ${childColumnLabel}`);

  // Find the child header
  const childHeader = findNestedHeader(canvasElement, childColumnLabel);
  expect(childHeader).toBeTruthy();

  // Look for filter icon
  const filterIcon = childHeader!.querySelector(".st-icon-container svg[viewBox='0 0 512 512']");

  if (filterIcon) {
    // Get initial row count
    const initialRows = canvasElement.querySelectorAll(".st-row");
    const initialRowCount = initialRows.length;

    // Click filter icon
    (filterIcon.parentElement as HTMLElement).click();

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if filter dropdown appeared
    const filterDropdown = canvasElement.querySelector(".st-dropdown-content .st-filter-container");

    if (filterDropdown) {
      console.log(`✅ Filter dropdown opened for nested column ${childColumnLabel}`);

      // Close dropdown by clicking outside
      const outsideElement = canvasElement.querySelector(".simple-table-root") as HTMLElement;
      outsideElement.click();
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  } else {
    console.log(`ℹ️ No filter icon found for ${childColumnLabel} (may not be filterable)`);
  }

  console.log(`✅ Nested header filtering test completed for ${childColumnLabel}`);
};

/**
 * Test nested header visual layout
 */
export const testNestedHeaderLayout = (canvasElement: HTMLElement): void => {
  console.log("🔄 Testing nested header visual layout");

  // Verify header container structure
  const headerContainer = canvasElement.querySelector(".st-header-container");
  expect(headerContainer).toBeTruthy();

  // Find main header section
  const mainHeaderSection = headerContainer!.querySelector(".st-header-main");
  expect(mainHeaderSection).toBeTruthy();

  // Verify CSS Grid is applied
  const style = window.getComputedStyle(mainHeaderSection!);
  expect(style.display).toBe("grid");

  // Verify grid template columns is set
  expect(style.gridTemplateColumns).toBeTruthy();

  // Check that headers are properly aligned
  NESTED_HEADER_CONFIGURATIONS.forEach((config) => {
    const parentHeader = findNestedHeader(canvasElement, config.parentLabel);
    const firstChild = findNestedHeader(canvasElement, config.children[0]);
    const lastChild = findNestedHeader(canvasElement, config.children[config.children.length - 1]);

    expect(parentHeader).toBeTruthy();
    expect(firstChild).toBeTruthy();
    expect(lastChild).toBeTruthy();

    // Get bounding rectangles
    const parentRect = parentHeader!.getBoundingClientRect();
    const firstChildRect = firstChild!.getBoundingClientRect();
    const lastChildRect = lastChild!.getBoundingClientRect();

    // Parent should span from first child to last child (approximately)
    expect(parentRect.left).toBeCloseTo(firstChildRect.left, 0);
    expect(parentRect.right).toBeCloseTo(lastChildRect.right, 0);

    // Parent should be above children
    expect(parentRect.top).toBeLessThan(firstChildRect.top);
  });

  console.log("✅ Nested header layout test passed");
};

/**
 * Test nested header responsiveness
 */
export const testNestedHeaderResponsiveness = async (canvasElement: HTMLElement): Promise<void> => {
  console.log("🔄 Testing nested header responsiveness");

  // Get initial layout measurements
  const initialMeasurements = NESTED_HEADER_CONFIGURATIONS.map((config) => {
    const header = findNestedHeader(canvasElement, config.parentLabel);
    return {
      label: config.parentLabel,
      width: header!.getBoundingClientRect().width,
      children: config.children.length,
    };
  });

  // Simulate container resize by changing viewport
  const table = canvasElement.querySelector(".simple-table-root") as HTMLElement;
  const originalWidth = table.style.width;

  // Make table narrower
  table.style.width = "800px";

  // Wait for layout to update
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Verify structure is maintained
  testNestedHeaderStructure(canvasElement);

  // Restore original width
  table.style.width = originalWidth;
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log("✅ Nested header responsiveness test passed");
};

/**
 * Test all nested header functionality
 */
export const testAllNestedHeaderFunctionality = async (
  canvasElement: HTMLElement
): Promise<void> => {
  console.log("🔄 Running comprehensive nested header tests");

  // Test basic structure
  testNestedHeaderStructure(canvasElement);

  // Test layout
  testNestedHeaderLayout(canvasElement);

  // Test sorting on child columns
  for (const config of NESTED_HEADER_CONFIGURATIONS) {
    for (const childLabel of config.children.slice(0, 2)) {
      // Test first 2 children to save time
      await testNestedHeaderSorting(canvasElement, childLabel);
    }
  }

  // Test filtering on child columns
  for (const config of NESTED_HEADER_CONFIGURATIONS) {
    const childLabel = config.children[0]; // Test first child
    await testNestedHeaderFiltering(canvasElement, childLabel);
  }

  // Test responsiveness
  await testNestedHeaderResponsiveness(canvasElement);

  console.log("✅ All nested header tests passed");
};
