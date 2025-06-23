import { expect } from "@storybook/test";
import { waitForTable } from "./commonTestUtils";
import { CELL_RENDERER_STYLES, CELL_RENDERER_DATA } from "../examples/CellRenderer";

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
 * Test that custom header renderers are working correctly
 */
export const testCustomHeaderRenderers = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  // Test ID header (darkred background, bold, emoji)
  const idHeader = canvasElement.querySelector(
    '#cell-id-0 .st-header-label-text div[style*="rgb(139, 0, 0)"]'
  );
  expect(idHeader).toBeInTheDocument();
  expect(idHeader).toHaveStyle(
    `background-color: ${CELL_RENDERER_STYLES.header.id.backgroundColor}`
  );
  expect(idHeader).toHaveStyle(`color: ${CELL_RENDERER_STYLES.header.id.color}`);
  expect(idHeader).toHaveStyle(`font-weight: ${CELL_RENDERER_STYLES.header.id.fontWeight}`);
  expect(idHeader?.textContent).toContain(
    `${CELL_RENDERER_STYLES.emojis.id} ${CELL_RENDERER_STYLES.text.id}`
  );

  // Test Name header (darkblue background, italic, emoji)
  const nameHeader = canvasElement.querySelector(
    '#cell-name-0 .st-header-label-text div[style*="rgb(0, 0, 139)"]'
  );
  expect(nameHeader).toBeInTheDocument();
  expect(nameHeader).toHaveStyle(
    `background-color: ${CELL_RENDERER_STYLES.header.name.backgroundColor}`
  );
  expect(nameHeader).toHaveStyle(`color: ${CELL_RENDERER_STYLES.header.name.color}`);
  expect(nameHeader).toHaveStyle(`font-style: ${CELL_RENDERER_STYLES.header.name.fontStyle}`);
  expect(nameHeader?.textContent).toContain(
    `${CELL_RENDERER_STYLES.emojis.name} ${CELL_RENDERER_STYLES.text.name}`
  );

  // Test Age header (darkgreen background, uppercase, emoji)
  const ageHeader = canvasElement.querySelector(
    '#cell-age-0 .st-header-label-text div[style*="rgb(0, 100, 0)"]'
  );
  expect(ageHeader).toBeInTheDocument();
  expect(ageHeader).toHaveStyle(
    `background-color: ${CELL_RENDERER_STYLES.header.age.backgroundColor}`
  );
  expect(ageHeader).toHaveStyle(`color: ${CELL_RENDERER_STYLES.header.age.color}`);
  expect(ageHeader).toHaveStyle(`text-transform: ${CELL_RENDERER_STYLES.header.age.textTransform}`);
  expect(ageHeader?.textContent).toContain(
    `${CELL_RENDERER_STYLES.emojis.age} ${CELL_RENDERER_STYLES.text.age}`
  );

  // Test Role header (orange background, border, emoji)
  const roleHeader = canvasElement.querySelector(
    '#cell-role-0 .st-header-label-text div[style*="rgb(255, 165, 0)"]'
  );
  expect(roleHeader).toBeInTheDocument();
  expect(roleHeader).toHaveStyle(
    `background-color: ${CELL_RENDERER_STYLES.header.role.backgroundColor}`
  );
  expect(roleHeader).toHaveStyle(`color: ${CELL_RENDERER_STYLES.header.role.color}`);
  expect(roleHeader).toHaveStyle(`border: ${CELL_RENDERER_STYLES.header.role.border}`);
  expect(roleHeader?.textContent).toContain(
    `${CELL_RENDERER_STYLES.emojis.role} ${CELL_RENDERER_STYLES.text.role}`
  );
};

/**
 * Test that custom cell renderers are working correctly
 */
export const testCustomCellRenderers = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  // Test ID column cells (red background)
  const idCells = canvasElement.querySelectorAll(
    '[data-accessor="id"] .st-cell-content div[style*="rgb(255, 0, 0)"]'
  );
  expect(idCells.length).toBeGreaterThan(0);

  // Check first ID cell
  const firstIdCell = idCells[0] as HTMLElement;
  expect(firstIdCell).toHaveStyle(
    `background-color: ${CELL_RENDERER_STYLES.cell.id.backgroundColor}`
  );
  // Check the inline style directly since computed style may be different due to table layout
  expect(firstIdCell.style.width).toBe(CELL_RENDERER_STYLES.cell.id.width);
  expect(firstIdCell).toHaveStyle(`overflow: ${CELL_RENDERER_STYLES.cell.id.overflow}`);
  expect(firstIdCell?.textContent).toBe(String(CELL_RENDERER_DATA[0].id));

  // Test Name column cells (blue background)
  const nameCells = canvasElement.querySelectorAll(
    '[data-accessor="name"] .st-cell-content div[style*="rgb(0, 0, 255)"]'
  );
  expect(nameCells.length).toBeGreaterThan(0);

  // Check first Name cell
  const firstNameCell = nameCells[0] as HTMLElement;
  expect(firstNameCell).toHaveStyle(
    `background-color: ${CELL_RENDERER_STYLES.cell.name.backgroundColor}`
  );
  // Check the inline style directly since computed style may be different due to table layout
  expect(firstNameCell.style.width).toBe(CELL_RENDERER_STYLES.cell.name.width);
  expect(firstNameCell).toHaveStyle(`overflow: ${CELL_RENDERER_STYLES.cell.name.overflow}`);
  expect(firstNameCell?.textContent).toBe(CELL_RENDERER_DATA[0].name);

  // Test Age column cells (green background)
  const ageCells = canvasElement.querySelectorAll(
    '[data-accessor="age"] .st-cell-content div[style*="rgb(0, 128, 0)"]'
  );
  expect(ageCells.length).toBeGreaterThan(0);

  // Check first Age cell
  const firstAgeCell = ageCells[0] as HTMLElement;
  expect(firstAgeCell).toHaveStyle(
    `background-color: ${CELL_RENDERER_STYLES.cell.age.backgroundColor}`
  );
  // Check the inline style directly since computed style may be different due to table layout
  expect(firstAgeCell.style.width).toBe(CELL_RENDERER_STYLES.cell.age.width);
  expect(firstAgeCell?.textContent).toBe(String(CELL_RENDERER_DATA[0].age));

  // Test Role column cells (yellow background)
  const roleCells = canvasElement.querySelectorAll(
    '[data-accessor="role"] .st-cell-content div[style*="rgb(255, 255, 0)"]'
  );
  expect(roleCells.length).toBeGreaterThan(0);

  // Check first Role cell
  const firstRoleCell = roleCells[0] as HTMLElement;
  expect(firstRoleCell).toHaveStyle(
    `background-color: ${CELL_RENDERER_STYLES.cell.role.backgroundColor}`
  );
  expect(firstRoleCell?.textContent).toBe(CELL_RENDERER_DATA[0].role);
};

/**
 * Test that custom renderers maintain data integrity
 */
export const testCustomRenderersDataIntegrity = async (
  canvasElement: HTMLElement
): Promise<void> => {
  await waitForTable();

  // Test that all expected data is present in custom rendered cells
  const rows = canvasElement.querySelectorAll(".st-row");
  expect(rows.length).toBeGreaterThanOrEqual(CELL_RENDERER_DATA.length);

  // Test first few rows for data integrity
  for (let i = 0; i < Math.min(3, CELL_RENDERER_DATA.length); i++) {
    const expectedRow = CELL_RENDERER_DATA[i];

    // Check ID cell
    const idCell = canvasElement.querySelector(
      `[data-row-id="${expectedRow.id}"][data-accessor="id"] .st-cell-content div`
    );
    expect(idCell?.textContent).toBe(String(expectedRow.id));

    // Check Name cell
    const nameCell = canvasElement.querySelector(
      `[data-row-id="${expectedRow.id}"][data-accessor="name"] .st-cell-content div`
    );
    expect(nameCell?.textContent).toBe(expectedRow.name);

    // Check Age cell
    const ageCell = canvasElement.querySelector(
      `[data-row-id="${expectedRow.id}"][data-accessor="age"] .st-cell-content div`
    );
    expect(ageCell?.textContent).toBe(String(expectedRow.age));

    // Check Role cell
    const roleCell = canvasElement.querySelector(
      `[data-row-id="${expectedRow.id}"][data-accessor="role"] .st-cell-content div`
    );
    expect(roleCell?.textContent).toBe(expectedRow.role);
  }
};

/**
 * Test that custom renderers maintain proper structure
 */
export const testCustomRenderersStructure = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  // Test that custom headers are properly wrapped
  const customHeaders = canvasElement.querySelectorAll(
    ".st-header-label-text div[style*='background-color']"
  );
  expect(customHeaders.length).toBe(4); // ID, Name, Age, Role

  // Test that each header has the expected styling structure
  customHeaders.forEach((header, index) => {
    const headerElement = header as HTMLElement;
    expect(headerElement).toHaveStyle("padding: 4px 8px");
    expect(headerElement).toHaveStyle("border-radius: 4px");
    expect(headerElement.style.backgroundColor).toBeTruthy();
  });

  // Test that custom cells are properly wrapped
  const customCells = canvasElement.querySelectorAll(
    ".st-cell-content div[style*='background-color']"
  );
  expect(customCells.length).toBeGreaterThan(0);

  // Test structural consistency across all custom cells
  customCells.forEach((cell, index) => {
    const cellElement = cell as HTMLElement;
    expect(cellElement.style.backgroundColor).toBeTruthy();
    // ID, Name, and Age cells should have width: 100% in their inline styles
    const parentCell = cellElement.closest("[data-accessor]");
    const accessor = parentCell?.getAttribute("data-accessor");
    if (accessor === "id" || accessor === "name" || accessor === "age") {
      expect(cellElement.style.width).toBe("100%");
    }
  });
};

/**
 * Test custom renderers with theme integration
 */
export const testCustomRenderersWithTheme = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  // Test that custom renderers work alongside default theme
  const table = canvasElement.querySelector(".simple-table-root");
  expect(table).toBeInTheDocument();

  // Test that custom styling overrides default styling appropriately
  const customStyledCells = canvasElement.querySelectorAll(
    ".st-cell-content div[style*='background-color']"
  );

  customStyledCells.forEach((cell) => {
    const cellElement = cell as HTMLElement;
    // Custom cells should have custom background colors
    const bgColor = cellElement.style.backgroundColor;
    expect([
      CELL_RENDERER_STYLES.cell.id.backgroundColor,
      CELL_RENDERER_STYLES.cell.name.backgroundColor,
      CELL_RENDERER_STYLES.cell.age.backgroundColor,
      CELL_RENDERER_STYLES.cell.role.backgroundColor,
    ]).toContain(bgColor);
  });
};

/**
 * Comprehensive test that combines all custom renderer tests
 */
export const testCustomRenderersComprehensive = async (
  canvasElement: HTMLElement
): Promise<void> => {
  // Run all tests in sequence
  await testCustomHeaderRenderers(canvasElement);
  await testCustomCellRenderers(canvasElement);
  await testCustomRenderersDataIntegrity(canvasElement);
  await testCustomRenderersStructure(canvasElement);
  await testCustomRenderersWithTheme(canvasElement);
};

// Export test data accessors
export const getCellRendererTestData = () => CELL_RENDERER_DATA;
export const getCellRendererStyles = () => CELL_RENDERER_STYLES;
