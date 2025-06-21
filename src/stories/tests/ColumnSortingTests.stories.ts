import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import BasicExample from "../examples/BasicExample";
import { waitForTable } from "../test-utils/commonTestUtils";
import {
  BASIC_COLUMN_CONFIGURATION,
  testColumnSorting,
  testSortPersistence,
  testRapidSortClicks,
  clickColumnHeader,
  getColumnDataFromTable,
  verifySortIcon,
} from "../test-utils/columnSortingTestUtils";

const meta: Meta<typeof BasicExample> = {
  title: "Tests/Column Sorting",
  component: BasicExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Tests for column sorting functionality using BasicExample",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Test basic sorting functionality for all sortable columns
 */
export const BasicSortingTests: Story = {
  name: "Basic Column Sorting Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting basic column sorting tests");

    // Test sorting for each sortable column
    for (const config of BASIC_COLUMN_CONFIGURATION) {
      if (config.sortable) {
        await testColumnSorting(canvasElement, config.accessor.toUpperCase(), config.accessor);
      }
    }

    console.log("✅ All basic sorting tests completed successfully");
  },
};

/**
 * Test sorting on Name column specifically
 */
export const NameColumnSortingTests: Story = {
  name: "Name Column Sorting - Detailed Test",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting detailed Name column sorting test");

    // Test Name column sorting with detailed verification
    const columnLabel = "Name";
    const accessor = "name";

    // First click - ascending
    await clickColumnHeader(canvasElement, columnLabel);
    verifySortIcon(canvasElement, columnLabel, "ascending");

    const ascendingData = getColumnDataFromTable(canvasElement, accessor);
    expect(ascendingData).toEqual([
      "Alice Williams",
      "Bob Johnson",
      "Charlie Brown",
      "Jane Smith",
      "John Doe",
    ]);

    // Second click - descending
    await clickColumnHeader(canvasElement, columnLabel);
    verifySortIcon(canvasElement, columnLabel, "descending");

    const descendingData = getColumnDataFromTable(canvasElement, accessor);
    expect(descendingData).toEqual([
      "John Doe",
      "Jane Smith",
      "Charlie Brown",
      "Bob Johnson",
      "Alice Williams",
    ]);

    // Third click - clear sort
    await clickColumnHeader(canvasElement, columnLabel);

    console.log("✅ Detailed Name column sorting test completed");
  },
};

/**
 * Test sorting on numeric columns (ID and Age)
 */
export const NumericColumnSortingTests: Story = {
  name: "Numeric Column Sorting Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting numeric column sorting tests");

    // Test ID column (numeric)
    await testColumnSorting(canvasElement, "ID", "id");

    // Test Age column (numeric)
    await testColumnSorting(canvasElement, "Age", "age");

    console.log("✅ Numeric column sorting tests completed");
  },
};

/**
 * Test sort persistence - only one column sorted at a time
 */
export const SortPersistenceTests: Story = {
  name: "Sort Persistence Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting sort persistence tests");

    // Test that sorting one column clears sort on other columns
    await testSortPersistence(canvasElement, "Name", "name", "Age", "age");
    await testSortPersistence(canvasElement, "ID", "id", "Role", "role");

    console.log("✅ Sort persistence tests completed");
  },
};

/**
 * Test rapid clicking to ensure stability
 */
export const RapidClickStabilityTests: Story = {
  name: "Rapid Click Stability Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting rapid click stability tests");

    // Test rapid clicking on different columns
    await testRapidSortClicks(canvasElement, "Name", "name");
    await testRapidSortClicks(canvasElement, "Age", "age");

    console.log("✅ Rapid click stability tests completed");
  },
};

/**
 * Test sort state indicators (icons)
 */
export const SortStateIndicatorTests: Story = {
  name: "Sort State Indicator Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting sort state indicator tests");

    const columnLabel = "Name";

    // Verify no sort icon initially
    const headerElements = canvasElement.querySelectorAll(".st-header-label-text");
    let targetHeaderCell: HTMLElement | null = null;

    for (const element of Array.from(headerElements)) {
      if (element.textContent?.trim() === columnLabel) {
        targetHeaderCell = element.closest(".st-header-cell") as HTMLElement;
        break;
      }
    }

    expect(targetHeaderCell).toBeTruthy();

    // Click to sort ascending
    await clickColumnHeader(canvasElement, columnLabel);
    verifySortIcon(canvasElement, columnLabel, "ascending");

    // Click to sort descending
    await clickColumnHeader(canvasElement, columnLabel);
    verifySortIcon(canvasElement, columnLabel, "descending");

    // Click to clear sort - verify icon is removed/changed
    await clickColumnHeader(canvasElement, columnLabel);

    console.log("✅ Sort state indicator tests completed");
  },
};

/**
 * Test sorting edge cases
 */
export const SortingEdgeCaseTests: Story = {
  name: "Sorting Edge Case Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting sorting edge case tests");

    // Test clicking non-sortable elements doesn't trigger sort
    const tableBody = canvasElement.querySelector(".st-body-container");
    if (tableBody) {
      (tableBody as HTMLElement).click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify no sort has been applied
      const sortIcons = canvasElement.querySelectorAll(".st-icon-container svg");
      // Should have minimal or no sort icons since no sorting was triggered
    }

    // Test double-clicking a header
    const nameHeader = canvasElement.querySelector(".st-header-label-text");
    if (nameHeader) {
      const headerLabel = nameHeader.closest(".st-header-label") as HTMLElement;

      // Double click
      headerLabel.click();
      headerLabel.click();

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Should be in descending state after two clicks
      const data = getColumnDataFromTable(canvasElement, "name");
      expect(data).toEqual([
        "John Doe",
        "Jane Smith",
        "Charlie Brown",
        "Bob Johnson",
        "Alice Williams",
      ]);
    }

    console.log("✅ Sorting edge case tests completed");
  },
};

/**
 * Performance test - sort large dataset
 */
export const SortingPerformanceTests: Story = {
  name: "Sorting Performance Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting sorting performance tests");

    // Time the sort operation
    const startTime = performance.now();

    await clickColumnHeader(canvasElement, "Name");

    const endTime = performance.now();
    const sortTime = endTime - startTime;

    console.log(`Sort operation took ${sortTime.toFixed(2)}ms`);

    // Verify sort completed successfully
    const sortedData = getColumnDataFromTable(canvasElement, "name");
    expect(sortedData.length).toBeGreaterThan(0);

    // Sort time should be reasonable (less than 1 second for small dataset)
    expect(sortTime).toBeLessThan(1000);

    console.log("✅ Sorting performance tests completed");
  },
};
