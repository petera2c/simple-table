import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CellRendererExample, {
  CELL_RENDERER_STYLES,
  cellRendererDefaults,
} from "../examples/CellRenderer";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import {
  testCustomRenderersComprehensive,
  testCustomHeaderRenderers,
  testCustomCellRenderers,
  testCustomRenderersDataIntegrity,
  testCustomRenderersStructure,
  testCustomRenderersWithTheme,
} from "../test-utils/customRendererTestUtils";
import { expect } from "@storybook/test";

const meta: Meta<typeof CellRendererExample> = {
  title: "Tests/Custom Renderer Tests",
  component: CellRendererExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

/**
 * Comprehensive custom renderer tests covering header renderers,
 * cell renderers, data integrity, structure validation, and theme compatibility
 */
export const ComprehensiveCustomRendererTests: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...cellRendererDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CellRendererExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      // Run the comprehensive test suite
      await testCustomRenderersComprehensive(canvasElement);

      // Additional specific tests with multiple expect statements

      // Test 1: Header renderers with detailed validation
      await testCustomHeaderRenderers(canvasElement);

      // Verify specific header styles
      const idHeader = canvasElement.querySelector("#cell-id-0 .st-header-label-text div");
      expect(idHeader).toHaveStyle(
        `background-color: ${CELL_RENDERER_STYLES.header.id.backgroundColor}`
      );
      expect(idHeader).toHaveStyle(`color: ${CELL_RENDERER_STYLES.header.id.color}`);
      expect(idHeader).toHaveStyle("padding: 4px 8px");
      expect(idHeader).toHaveStyle("border-radius: 4px");
      expect(idHeader).toHaveStyle(`font-weight: ${CELL_RENDERER_STYLES.header.id.fontWeight}`);
      expect(idHeader?.textContent).toBe("🆔 ID");

      const nameHeader = canvasElement.querySelector("#cell-name-0 .st-header-label-text div");
      expect(nameHeader).toHaveStyle(
        `background-color: ${CELL_RENDERER_STYLES.header.name.backgroundColor}`
      );
      expect(nameHeader).toHaveStyle(`color: ${CELL_RENDERER_STYLES.header.name.color}`);
      expect(nameHeader).toHaveStyle("padding: 4px 8px");
      expect(nameHeader).toHaveStyle("border-radius: 4px");
      expect(nameHeader).toHaveStyle(`font-style: ${CELL_RENDERER_STYLES.header.name.fontStyle}`);
      expect(nameHeader?.textContent).toBe("👤 Name");

      const ageHeader = canvasElement.querySelector("#cell-age-0 .st-header-label-text div");
      expect(ageHeader).toHaveStyle(
        `background-color: ${CELL_RENDERER_STYLES.header.age.backgroundColor}`
      );
      expect(ageHeader).toHaveStyle(`color: ${CELL_RENDERER_STYLES.header.age.color}`);
      expect(ageHeader).toHaveStyle("padding: 4px 8px");
      expect(ageHeader).toHaveStyle("border-radius: 4px");
      expect(ageHeader).toHaveStyle(
        `text-transform: ${CELL_RENDERER_STYLES.header.age.textTransform}`
      );
      expect(ageHeader?.textContent).toBe("🎂 Age"); // Note: text-transform: uppercase is applied via CSS, not in textContent

      const roleHeader = canvasElement.querySelector("#cell-role-0 .st-header-label-text div");
      expect(roleHeader).toHaveStyle(
        `background-color: ${CELL_RENDERER_STYLES.header.role.backgroundColor}`
      );
      expect(roleHeader).toHaveStyle(`color: ${CELL_RENDERER_STYLES.header.role.color}`);
      expect(roleHeader).toHaveStyle("padding: 4px 8px");
      expect(roleHeader).toHaveStyle("border-radius: 4px");
      expect(roleHeader).toHaveStyle(`border: ${CELL_RENDERER_STYLES.header.role.border}`);
      expect(roleHeader?.textContent).toBe("💼 Role");

      // Test 2: Cell renderers with detailed validation
      await testCustomCellRenderers(canvasElement);

      // Verify specific cell styles for multiple rows
      const testRows = [
        { rowIndex: 0, expectedData: { id: "1", name: "John Doe", age: "28", role: "Developer" } },
        { rowIndex: 1, expectedData: { id: "2", name: "Jane Smith", age: "32", role: "Designer" } },
        { rowIndex: 2, expectedData: { id: "3", name: "Bob Johnson", age: "45", role: "Manager" } },
      ];

      testRows.forEach(({ rowIndex, expectedData }) => {
        // ID cell tests
        const idCell = canvasElement.querySelector(
          `[data-row-index="${rowIndex}"][data-accessor="id"] .st-cell-content div`
        );
        expect(idCell).toHaveStyle(
          `background-color: ${CELL_RENDERER_STYLES.cell.id.backgroundColor}`
        );
        // Check inline style for width since computed style may differ
        expect((idCell as HTMLElement)?.style.width).toBe(CELL_RENDERER_STYLES.cell.id.width);
        expect(idCell).toHaveStyle(`overflow: ${CELL_RENDERER_STYLES.cell.id.overflow}`);
        expect(idCell?.textContent).toBe(expectedData.id);

        // Name cell tests
        const nameCell = canvasElement.querySelector(
          `[data-row-index="${rowIndex}"][data-accessor="name"] .st-cell-content div`
        );
        expect(nameCell).toHaveStyle(
          `background-color: ${CELL_RENDERER_STYLES.cell.name.backgroundColor}`
        );
        // Check inline style for width since computed style may differ
        expect((nameCell as HTMLElement)?.style.width).toBe(CELL_RENDERER_STYLES.cell.name.width);
        expect(nameCell).toHaveStyle(`overflow: ${CELL_RENDERER_STYLES.cell.name.overflow}`);
        expect(nameCell?.textContent).toBe(expectedData.name);

        // Age cell tests
        const ageCell = canvasElement.querySelector(
          `[data-row-index="${rowIndex}"][data-accessor="age"] .st-cell-content div`
        );
        expect(ageCell).toHaveStyle(
          `background-color: ${CELL_RENDERER_STYLES.cell.age.backgroundColor}`
        );
        // Check inline style for width since computed style may differ
        expect((ageCell as HTMLElement)?.style.width).toBe(CELL_RENDERER_STYLES.cell.age.width);
        expect(ageCell?.textContent).toBe(expectedData.age);

        // Role cell tests
        const roleCell = canvasElement.querySelector(
          `[data-row-index="${rowIndex}"][data-accessor="role"] .st-cell-content div`
        );
        expect(roleCell).toHaveStyle(
          `background-color: ${CELL_RENDERER_STYLES.cell.role.backgroundColor}`
        );
        expect(roleCell?.textContent).toBe(expectedData.role);
      });

      // Test 3: Verify all cells have custom renderers
      const allIdCells = canvasElement.querySelectorAll(
        '[data-accessor="id"] .st-cell-content div[style*="rgb(255, 0, 0)"]'
      );
      const allNameCells = canvasElement.querySelectorAll(
        '[data-accessor="name"] .st-cell-content div[style*="rgb(0, 0, 255)"]'
      );
      const allAgeCells = canvasElement.querySelectorAll(
        '[data-accessor="age"] .st-cell-content div[style*="rgb(0, 128, 0)"]'
      );
      const allRoleCells = canvasElement.querySelectorAll(
        '[data-accessor="role"] .st-cell-content div[style*="rgb(255, 255, 0)"]'
      );

      expect(allIdCells.length).toBe(5); // 5 rows
      expect(allNameCells.length).toBe(5); // 5 rows
      expect(allAgeCells.length).toBe(5); // 5 rows
      expect(allRoleCells.length).toBe(5); // 5 rows

      // Test 4: Data integrity validation
      await testCustomRenderersDataIntegrity(canvasElement);

      // Test 5: Structure validation
      await testCustomRenderersStructure(canvasElement);

      // Additional structure tests
      const tableRoot = canvasElement.querySelector(".simple-table-root");
      expect(tableRoot).toBeInTheDocument();
      expect(tableRoot).toHaveClass("theme-light");

      const headerContainer = canvasElement.querySelector(".st-header-container");
      expect(headerContainer).toBeInTheDocument();

      const bodyContainer = canvasElement.querySelector(".st-body-container");
      expect(bodyContainer).toBeInTheDocument();

      // Test 6: Theme compatibility
      await testCustomRenderersWithTheme(canvasElement);

      // Test 7: Verify no default content is shown

      // Check that raw text content is not visible outside custom divs
      const rawIdTexts = canvasElement.querySelectorAll(
        '[data-accessor="id"] .st-cell-content > span > span:not(:has(div))'
      );
      expect(rawIdTexts.length).toBe(0); // Should be 0 since content is in custom divs

      // Verify all content is wrapped in custom renderer divs
      const customCellDivs = canvasElement.querySelectorAll(
        '.st-cell-content div[style*="background-color"]'
      );
      expect(customCellDivs.length).toBe(20); // 4 columns × 5 rows = 20 cells

      // Test 8: Verify emoji content in headers
      const headerEmojis = [
        { selector: "#cell-id-0", emoji: "🆔" },
        { selector: "#cell-name-0", emoji: "👤" },
        { selector: "#cell-age-0", emoji: "🎂" },
        { selector: "#cell-role-0", emoji: "💼" },
      ];

      headerEmojis.forEach(({ selector, emoji }) => {
        const header = canvasElement.querySelector(`${selector} .st-header-label-text div`);
        expect(header?.textContent).toContain(emoji);
      });
    } catch (error) {
      console.error("Custom renderer test failed:", error);
      throw error;
    }
  },
};

/**
 * Test custom header renderers functionality
 */
export const CustomHeaderRenderersTest: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...cellRendererDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CellRendererExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      // Test header renderers
      await testCustomHeaderRenderers(canvasElement);

      // Additional header-specific tests

      // Test that each header has the expected structure
      const headers = [
        { id: "cell-id-0", bgColor: CELL_RENDERER_STYLES.header.id.backgroundColor, text: "🆔 ID" },
        {
          id: "cell-name-0",
          bgColor: CELL_RENDERER_STYLES.header.name.backgroundColor,
          text: "👤 Name",
        },
        {
          id: "cell-age-0",
          bgColor: CELL_RENDERER_STYLES.header.age.backgroundColor,
          text: "🎂 Age", // Note: text-transform: uppercase is applied via CSS, not in textContent
        },
        {
          id: "cell-role-0",
          bgColor: CELL_RENDERER_STYLES.header.role.backgroundColor,
          text: "💼 Role",
        },
      ];

      headers.forEach(({ id, bgColor, text }) => {
        const header = canvasElement.querySelector(`#${id} .st-header-label-text div`);
        expect(header).toBeInTheDocument();
        expect(header).toHaveStyle(`background-color: ${bgColor}`);
        expect(header?.textContent).toBe(text);

        // Verify it's properly nested
        const headerCell = canvasElement.querySelector(`#${id}`);
        expect(headerCell).toHaveClass("st-header-cell");
        expect(headerCell).toHaveClass("clickable");
      });
    } catch (error) {
      console.error("Custom header renderers test failed:", error);
      throw error;
    }
  },
};

/**
 * Test custom cell renderers functionality
 */
export const CustomCellRenderersTest: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...cellRendererDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: CellRendererExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      // Test cell renderers
      await testCustomCellRenderers(canvasElement);

      // Additional cell-specific tests

      // Test cell renderer consistency across all rows
      const expectedCellColors = {
        id: CELL_RENDERER_STYLES.cell.id.backgroundColor,
        name: CELL_RENDERER_STYLES.cell.name.backgroundColor,
        age: CELL_RENDERER_STYLES.cell.age.backgroundColor,
        role: CELL_RENDERER_STYLES.cell.role.backgroundColor,
      };

      Object.entries(expectedCellColors).forEach(([accessor, color]) => {
        const cells = canvasElement.querySelectorAll(
          `[data-accessor="${accessor}"] .st-cell-content div`
        );
        expect(cells.length).toBe(5); // 5 rows

        cells.forEach((cell, index) => {
          expect(cell).toHaveStyle(`background-color: ${color}`);
          expect(cell).toBeInTheDocument();

          // Verify the cell has content
          expect(cell.textContent).toBeTruthy();
        });
      });

      // Test that cells maintain table structure
      const allCells = canvasElement.querySelectorAll(".st-cell");
      expect(allCells.length).toBe(20); // 4 columns × 5 rows

      allCells.forEach((cell) => {
        const customDiv = cell.querySelector('.st-cell-content div[style*="background-color"]');
        expect(customDiv).toBeInTheDocument();
      });
    } catch (error) {
      console.error("Custom cell renderers test failed:", error);
      throw error;
    }
  },
};
