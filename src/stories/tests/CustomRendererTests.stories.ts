import type { Meta, StoryObj } from "@storybook/react";
import CellRendererExample from "../examples/CellRenderer";
import {
  testCustomRenderersComprehensive,
  testCustomHeaderRenderers,
  testCustomCellRenderers,
  testCustomRenderersDataIntegrity,
  testCustomRenderersStructure,
  testCustomRenderersWithTheme,
  logCustomRendererState,
} from "../test-utils/customRendererTestUtils";
import { expect } from "@storybook/test";

const meta: Meta<typeof CellRendererExample> = {
  title: "Tests/Custom Renderer Tests",
  component: CellRendererExample,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Comprehensive custom renderer tests covering header renderers,
 * cell renderers, data integrity, structure validation, and theme compatibility
 */
export const ComprehensiveCustomRendererTests: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    console.log(`🚀 Starting Custom Renderer Tests`);
    console.log(`📋 Canvas element:`, canvasElement);

    try {
      // Check initial table state
      console.log(`🔍 Initial custom renderer inspection:`);
      logCustomRendererState(canvasElement);

      // Run the comprehensive test suite
      console.log(`🧪 Running comprehensive custom renderer test suite...`);
      await testCustomRenderersComprehensive(canvasElement);

      // Additional specific tests with multiple expect statements

      // Test 1: Header renderers with detailed validation
      console.log(`🧪 Test 1: Detailed header renderer validation`);
      await testCustomHeaderRenderers(canvasElement);

      // Verify specific header styles
      const idHeader = canvasElement.querySelector("#cell-id-0 .st-header-label-text div");
      expect(idHeader).toHaveStyle("background-color: darkred");
      expect(idHeader).toHaveStyle("color: white");
      expect(idHeader).toHaveStyle("padding: 4px 8px");
      expect(idHeader).toHaveStyle("border-radius: 4px");
      expect(idHeader).toHaveStyle("font-weight: bold");
      expect(idHeader?.textContent).toBe("🆔 ID");

      const nameHeader = canvasElement.querySelector("#cell-name-0 .st-header-label-text div");
      expect(nameHeader).toHaveStyle("background-color: darkblue");
      expect(nameHeader).toHaveStyle("color: white");
      expect(nameHeader).toHaveStyle("padding: 4px 8px");
      expect(nameHeader).toHaveStyle("border-radius: 4px");
      expect(nameHeader).toHaveStyle("font-style: italic");
      expect(nameHeader?.textContent).toBe("👤 Name");

      const ageHeader = canvasElement.querySelector("#cell-age-0 .st-header-label-text div");
      expect(ageHeader).toHaveStyle("background-color: darkgreen");
      expect(ageHeader).toHaveStyle("color: white");
      expect(ageHeader).toHaveStyle("padding: 4px 8px");
      expect(ageHeader).toHaveStyle("border-radius: 4px");
      expect(ageHeader).toHaveStyle("text-transform: uppercase");
      expect(ageHeader?.textContent).toBe("🎂 AGE");

      const roleHeader = canvasElement.querySelector("#cell-role-0 .st-header-label-text div");
      expect(roleHeader).toHaveStyle("background-color: orange");
      expect(roleHeader).toHaveStyle("color: white");
      expect(roleHeader).toHaveStyle("padding: 4px 8px");
      expect(roleHeader).toHaveStyle("border-radius: 4px");
      expect(roleHeader).toHaveStyle("border: 2px solid darkorange");
      expect(roleHeader?.textContent).toBe("💼 Role");

      // Test 2: Cell renderers with detailed validation
      console.log(`🧪 Test 2: Detailed cell renderer validation`);
      await testCustomCellRenderers(canvasElement);

      // Verify specific cell styles for multiple rows
      const testRows = [
        { rowIndex: 0, expectedData: { id: "1", name: "John Doe", age: "28", role: "Developer" } },
        { rowIndex: 1, expectedData: { id: "2", name: "Jane Smith", age: "32", role: "Designer" } },
        { rowIndex: 2, expectedData: { id: "3", name: "Bob Johnson", age: "45", role: "Manager" } },
      ];

      testRows.forEach(({ rowIndex, expectedData }) => {
        console.log(`🔍 Testing row ${rowIndex} custom renderers...`);

        // ID cell tests
        const idCell = canvasElement.querySelector(
          `[data-row-index="${rowIndex}"][data-accessor="id"] .st-cell-content div`
        );
        expect(idCell).toHaveStyle("background-color: red");
        expect(idCell).toHaveStyle("width: 100%");
        expect(idCell).toHaveStyle("overflow: hidden");
        expect(idCell?.textContent).toBe(expectedData.id);

        // Name cell tests
        const nameCell = canvasElement.querySelector(
          `[data-row-index="${rowIndex}"][data-accessor="name"] .st-cell-content div`
        );
        expect(nameCell).toHaveStyle("background-color: blue");
        expect(nameCell).toHaveStyle("width: 100%");
        expect(nameCell).toHaveStyle("overflow: hidden");
        expect(nameCell?.textContent).toBe(expectedData.name);

        // Age cell tests
        const ageCell = canvasElement.querySelector(
          `[data-row-index="${rowIndex}"][data-accessor="age"] .st-cell-content div`
        );
        expect(ageCell).toHaveStyle("background-color: green");
        expect(ageCell).toHaveStyle("width: 100%");
        expect(ageCell?.textContent).toBe(expectedData.age);

        // Role cell tests
        const roleCell = canvasElement.querySelector(
          `[data-row-index="${rowIndex}"][data-accessor="role"] .st-cell-content div`
        );
        expect(roleCell).toHaveStyle("background-color: yellow");
        expect(roleCell?.textContent).toBe(expectedData.role);
      });

      // Test 3: Verify all cells have custom renderers
      console.log(`🧪 Test 3: Verify all cells use custom renderers`);
      const allIdCells = canvasElement.querySelectorAll(
        '[data-accessor="id"] .st-cell-content div[style*="red"]'
      );
      const allNameCells = canvasElement.querySelectorAll(
        '[data-accessor="name"] .st-cell-content div[style*="blue"]'
      );
      const allAgeCells = canvasElement.querySelectorAll(
        '[data-accessor="age"] .st-cell-content div[style*="green"]'
      );
      const allRoleCells = canvasElement.querySelectorAll(
        '[data-accessor="role"] .st-cell-content div[style*="yellow"]'
      );

      expect(allIdCells.length).toBe(5); // 5 rows
      expect(allNameCells.length).toBe(5); // 5 rows
      expect(allAgeCells.length).toBe(5); // 5 rows
      expect(allRoleCells.length).toBe(5); // 5 rows

      // Test 4: Data integrity validation
      console.log(`🧪 Test 4: Data integrity validation`);
      await testCustomRenderersDataIntegrity(canvasElement);

      // Test 5: Structure validation
      console.log(`🧪 Test 5: Structure validation`);
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
      console.log(`🧪 Test 6: Theme compatibility`);
      await testCustomRenderersWithTheme(canvasElement);

      // Test 7: Verify no default content is shown
      console.log(`🧪 Test 7: Verify custom renderers override default content`);

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
      console.log(`🧪 Test 8: Emoji content validation`);
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

      console.log(`✅ All custom renderer tests passed!`);
    } catch (error) {
      console.error("Custom renderer test failed:", error);
      throw error;
    }
  },
};

/**
 * Test custom header renderers functionality
 */
export const CustomHeaderRenderersTest: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      console.log(`🎯 Testing custom header renderers...`);
      logCustomRendererState(canvasElement);

      // Test header renderers
      await testCustomHeaderRenderers(canvasElement);

      // Additional header-specific tests
      console.log(`🧪 Testing header renderer specifics...`);

      // Test that each header has the expected structure
      const headers = [
        { id: "cell-id-0", bgColor: "darkred", text: "🆔 ID" },
        { id: "cell-name-0", bgColor: "darkblue", text: "👤 Name" },
        { id: "cell-age-0", bgColor: "darkgreen", text: "🎂 AGE" },
        { id: "cell-role-0", bgColor: "orange", text: "💼 Role" },
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

      console.log(`✅ Custom header renderers tests passed!`);
    } catch (error) {
      console.error("Custom header renderers test failed:", error);
      throw error;
    }
  },
};

/**
 * Test custom cell renderers functionality
 */
export const CustomCellRenderersTest: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      console.log(`🎯 Testing custom cell renderers...`);
      logCustomRendererState(canvasElement);

      // Test cell renderers
      await testCustomCellRenderers(canvasElement);

      // Additional cell-specific tests
      console.log(`🧪 Testing cell renderer specifics...`);

      // Test cell renderer consistency across all rows
      const expectedCellColors = {
        id: "red",
        name: "blue",
        age: "green",
        role: "yellow",
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

      console.log(`✅ Custom cell renderers tests passed!`);
    } catch (error) {
      console.error("Custom cell renderers test failed:", error);
      throw error;
    }
  },
};
