import { expect } from "@storybook/test";
import { waitForTable } from "./commonTestUtils";

/**
 * Custom Renderer Test Utilities
 *
 * These utilities help test custom header and cell renderer functionality including:
 * - Custom header renderer validation
 * - Custom cell renderer validation
 * - Style and content verification
 * - Emoji and text content checks
 */

/**
 * Debug function to log custom renderer elements
 */
export const logCustomRendererState = (canvasElement: HTMLElement): void => {
  console.log(`🔍 === CUSTOM RENDERER STATE DEBUG ===`);

  // Check for custom header renderers
  const customHeaders = canvasElement.querySelectorAll(
    ".st-header-label-text div[style*='background-color']"
  );
  console.log(`🎨 Custom header renderers found: ${customHeaders.length}`);

  customHeaders.forEach((header, index) => {
    const headerElement = header as HTMLElement;
    console.log(
      `  Header ${index}:`,
      headerElement.textContent,
      headerElement.style.backgroundColor
    );
  });

  // Check for custom cell renderers
  const customCells = canvasElement.querySelectorAll(
    ".st-cell-content div[style*='background-color']"
  );
  console.log(`🎨 Custom cell renderers found: ${customCells.length}`);

  // Log first 10 custom cells for debugging
  Array.from(customCells)
    .slice(0, 10)
    .forEach((cell, index) => {
      const cellElement = cell as HTMLElement;
      console.log(`  Cell ${index}:`, cellElement.textContent, cellElement.style.backgroundColor);
    });

  console.log(`🔍 === END CUSTOM RENDERER STATE ===`);
};

/**
 * Test that custom header renderers are working correctly
 */
export const testCustomHeaderRenderers = async (canvasElement: HTMLElement): Promise<void> => {
  console.log(`🧪 Testing custom header renderers...`);

  await waitForTable();

  // Test ID header (darkred background, bold, emoji)
  console.log(`🔍 Testing ID header renderer...`);
  const idHeader = canvasElement.querySelector(
    '#cell-id-0 .st-header-label-text div[style*="darkred"]'
  );
  expect(idHeader).toBeInTheDocument();
  expect(idHeader).toHaveStyle("background-color: darkred");
  expect(idHeader).toHaveStyle("color: white");
  expect(idHeader).toHaveStyle("font-weight: bold");
  expect(idHeader?.textContent).toContain("🆔 ID");

  // Test Name header (darkblue background, italic, emoji)
  console.log(`🔍 Testing Name header renderer...`);
  const nameHeader = canvasElement.querySelector(
    '#cell-name-0 .st-header-label-text div[style*="darkblue"]'
  );
  expect(nameHeader).toBeInTheDocument();
  expect(nameHeader).toHaveStyle("background-color: darkblue");
  expect(nameHeader).toHaveStyle("color: white");
  expect(nameHeader).toHaveStyle("font-style: italic");
  expect(nameHeader?.textContent).toContain("👤 Name");

  // Test Age header (darkgreen background, uppercase, emoji)
  console.log(`🔍 Testing Age header renderer...`);
  const ageHeader = canvasElement.querySelector(
    '#cell-age-0 .st-header-label-text div[style*="darkgreen"]'
  );
  expect(ageHeader).toBeInTheDocument();
  expect(ageHeader).toHaveStyle("background-color: darkgreen");
  expect(ageHeader).toHaveStyle("color: white");
  expect(ageHeader).toHaveStyle("text-transform: uppercase");
  expect(ageHeader?.textContent).toContain("🎂 Age");

  // Test Role header (orange background, border, emoji)
  console.log(`🔍 Testing Role header renderer...`);
  const roleHeader = canvasElement.querySelector(
    '#cell-role-0 .st-header-label-text div[style*="orange"]'
  );
  expect(roleHeader).toBeInTheDocument();
  expect(roleHeader).toHaveStyle("background-color: orange");
  expect(roleHeader).toHaveStyle("color: white");
  expect(roleHeader).toHaveStyle("border: 2px solid darkorange");
  expect(roleHeader?.textContent).toContain("💼 Role");

  console.log(`✅ Custom header renderers test completed`);
};

/**
 * Test that custom cell renderers are working correctly
 */
export const testCustomCellRenderers = async (canvasElement: HTMLElement): Promise<void> => {
  console.log(`🧪 Testing custom cell renderers...`);

  await waitForTable();

  // Test ID column cells (red background)
  console.log(`🔍 Testing ID column cell renderers...`);
  const idCells = canvasElement.querySelectorAll(
    '[data-accessor="id"] .st-cell-content div[style*="red"]'
  );
  expect(idCells.length).toBeGreaterThan(0);

  // Check first ID cell
  const firstIdCell = idCells[0] as HTMLElement;
  expect(firstIdCell).toHaveStyle("background-color: red");
  expect(firstIdCell).toHaveStyle("width: 100%");
  expect(firstIdCell).toHaveStyle("overflow: hidden");
  expect(firstIdCell?.textContent).toBe("1");

  // Test Name column cells (blue background)
  console.log(`🔍 Testing Name column cell renderers...`);
  const nameCells = canvasElement.querySelectorAll(
    '[data-accessor="name"] .st-cell-content div[style*="blue"]'
  );
  expect(nameCells.length).toBeGreaterThan(0);

  // Check first Name cell
  const firstNameCell = nameCells[0] as HTMLElement;
  expect(firstNameCell).toHaveStyle("background-color: blue");
  expect(firstNameCell).toHaveStyle("width: 100%");
  expect(firstNameCell).toHaveStyle("overflow: hidden");
  expect(firstNameCell?.textContent).toBe("John Doe");

  // Test Age column cells (green background)
  console.log(`🔍 Testing Age column cell renderers...`);
  const ageCells = canvasElement.querySelectorAll(
    '[data-accessor="age"] .st-cell-content div[style*="green"]'
  );
  expect(ageCells.length).toBeGreaterThan(0);

  // Check first Age cell
  const firstAgeCell = ageCells[0] as HTMLElement;
  expect(firstAgeCell).toHaveStyle("background-color: green");
  expect(firstAgeCell).toHaveStyle("width: 100%");
  expect(firstAgeCell?.textContent).toBe("28");

  // Test Role column cells (yellow background)
  console.log(`🔍 Testing Role column cell renderers...`);
  const roleCells = canvasElement.querySelectorAll(
    '[data-accessor="role"] .st-cell-content div[style*="yellow"]'
  );
  expect(roleCells.length).toBeGreaterThan(0);

  // Check first Role cell
  const firstRoleCell = roleCells[0] as HTMLElement;
  expect(firstRoleCell).toHaveStyle("background-color: yellow");
  expect(firstRoleCell?.textContent).toBe("Developer");

  console.log(`✅ Custom cell renderers test completed`);
};

/**
 * Test that all expected data is rendered with custom renderers
 */
export const testCustomRenderersDataIntegrity = async (
  canvasElement: HTMLElement
): Promise<void> => {
  console.log(`🧪 Testing custom renderers data integrity...`);

  await waitForTable();

  // Expected data from CellRenderer.tsx
  const expectedRows = [
    { id: "1", name: "John Doe", age: "28", role: "Developer" },
    { id: "2", name: "Jane Smith", age: "32", role: "Designer" },
    { id: "3", name: "Bob Johnson", age: "45", role: "Manager" },
    { id: "4", name: "Alice Williams", age: "24", role: "Intern" },
    { id: "5", name: "Charlie Brown", age: "37", role: "DevOps" },
  ];

  // Test each row's data
  expectedRows.forEach((expectedRow, rowIndex) => {
    console.log(`🔍 Testing row ${rowIndex} data integrity...`);

    // Test ID cell
    const idCell = canvasElement.querySelector(
      `[data-row-index="${rowIndex}"][data-accessor="id"] .st-cell-content div`
    );
    expect(idCell?.textContent).toBe(expectedRow.id);
    expect(idCell).toHaveStyle("background-color: red");

    // Test Name cell
    const nameCell = canvasElement.querySelector(
      `[data-row-index="${rowIndex}"][data-accessor="name"] .st-cell-content div`
    );
    expect(nameCell?.textContent).toBe(expectedRow.name);
    expect(nameCell).toHaveStyle("background-color: blue");

    // Test Age cell
    const ageCell = canvasElement.querySelector(
      `[data-row-index="${rowIndex}"][data-accessor="age"] .st-cell-content div`
    );
    expect(ageCell?.textContent).toBe(expectedRow.age);
    expect(ageCell).toHaveStyle("background-color: green");

    // Test Role cell
    const roleCell = canvasElement.querySelector(
      `[data-row-index="${rowIndex}"][data-accessor="role"] .st-cell-content div`
    );
    expect(roleCell?.textContent).toBe(expectedRow.role);
    expect(roleCell).toHaveStyle("background-color: yellow");
  });

  console.log(`✅ Custom renderers data integrity test completed`);
};

/**
 * Test that custom renderers maintain proper structure
 */
export const testCustomRenderersStructure = async (canvasElement: HTMLElement): Promise<void> => {
  console.log(`🧪 Testing custom renderers structure...`);

  await waitForTable();

  // Test that custom headers are inside the correct structure
  console.log(`🔍 Testing header structure...`);
  const headerCells = canvasElement.querySelectorAll(".st-header-cell");
  expect(headerCells.length).toBe(4); // ID, Name, Age, Role

  headerCells.forEach((headerCell, index) => {
    const headerLabel = headerCell.querySelector(".st-header-label");
    expect(headerLabel).toBeInTheDocument();

    const headerLabelText = headerCell.querySelector(".st-header-label-text");
    expect(headerLabelText).toBeInTheDocument();

    const customDiv = headerCell.querySelector(
      '.st-header-label-text div[style*="background-color"]'
    );
    expect(customDiv).toBeInTheDocument();
  });

  // Test that custom cells are inside the correct structure
  console.log(`🔍 Testing cell structure...`);
  const cellRows = canvasElement.querySelectorAll(".st-row:not(.st-row-separator)");
  expect(cellRows.length).toBe(5); // 5 data rows

  cellRows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll(".st-cell");
    expect(cells.length).toBe(4); // 4 columns

    cells.forEach((cell, cellIndex) => {
      const cellContent = cell.querySelector(".st-cell-content");
      expect(cellContent).toBeInTheDocument();

      const customDiv = cell.querySelector('.st-cell-content div[style*="background-color"]');
      expect(customDiv).toBeInTheDocument();
    });
  });

  console.log(`✅ Custom renderers structure test completed`);
};

/**
 * Test that custom renderers work with different themes
 */
export const testCustomRenderersWithTheme = async (canvasElement: HTMLElement): Promise<void> => {
  console.log(`🧪 Testing custom renderers with theme...`);

  await waitForTable();

  // Check that the table has the light theme class
  const tableRoot = canvasElement.querySelector(".simple-table-root");
  expect(tableRoot).toHaveClass("theme-light");

  // Custom renderers should maintain their styling regardless of theme
  const customHeaderDivs = canvasElement.querySelectorAll(
    '.st-header-label-text div[style*="background-color"]'
  );
  const customCellDivs = canvasElement.querySelectorAll(
    '.st-cell-content div[style*="background-color"]'
  );

  expect(customHeaderDivs.length).toBe(4);
  expect(customCellDivs.length).toBeGreaterThan(0);

  // Verify custom styles are preserved
  const idHeader = canvasElement.querySelector('.st-header-label-text div[style*="darkred"]');
  expect(idHeader).toHaveStyle("background-color: darkred");

  const idCell = canvasElement.querySelector('.st-cell-content div[style*="red"]');
  expect(idCell).toHaveStyle("background-color: red");

  console.log(`✅ Custom renderers theme test completed`);
};

/**
 * Comprehensive custom renderer test suite
 */
export const testCustomRenderersComprehensive = async (
  canvasElement: HTMLElement
): Promise<void> => {
  console.log(`🧪 Running comprehensive custom renderer tests...`);

  // Debug initial state
  logCustomRendererState(canvasElement);

  // Test 1: Custom header renderers
  console.log(`🧪 Test 1: Custom header renderers`);
  await testCustomHeaderRenderers(canvasElement);

  // Test 2: Custom cell renderers
  console.log(`🧪 Test 2: Custom cell renderers`);
  await testCustomCellRenderers(canvasElement);

  // Test 3: Data integrity with custom renderers
  console.log(`🧪 Test 3: Data integrity with custom renderers`);
  await testCustomRenderersDataIntegrity(canvasElement);

  // Test 4: Structure validation
  console.log(`🧪 Test 4: Structure validation`);
  await testCustomRenderersStructure(canvasElement);

  // Test 5: Theme compatibility
  console.log(`🧪 Test 5: Theme compatibility`);
  await testCustomRenderersWithTheme(canvasElement);

  console.log(`✅ All comprehensive custom renderer tests completed successfully!`);
};
