import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import BillingExample from "../examples/billing-example/BillingExample";
import {
  getBillingMainColumnLabels,
  getBillingPinnedLeftColumnLabels,
} from "../test-utils/commonTestUtils";
import {
  testColumnSorting,
  testSortPersistence,
  testRapidSortClicks,
  testDataTypeSorting,
  testCrossSectionSorting,
} from "../test-utils/columnSortingTestUtils";

const meta: Meta<typeof BillingExample> = {
  title: "Tests/Column Sorting Tests",
  component: BillingExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Tests for column sorting functionality including ascending, descending, and clearing sort states",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Comprehensive column sorting test with multiple interactions
 */
export const ComprehensiveColumnSortingTest: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Get column groups dynamically from billing headers
    const mainCols = getBillingMainColumnLabels();
    const pinnedLeftCols = getBillingPinnedLeftColumnLabels();

    // Test 1: Basic column sorting (ascending → descending → clear)

    // Test string column (Name - pinned left)
    if (pinnedLeftCols.length > 0) {
      await testColumnSorting(canvas, canvasElement, pinnedLeftCols[0]); // "Name"
    }

    // Test number columns from main section
    if (mainCols.length > 0) {
      await testColumnSorting(canvas, canvasElement, mainCols[0]); // "Total Amount"
    }

    if (mainCols.length > 1) {
      await testColumnSorting(canvas, canvasElement, mainCols[1]); // "Deferred Revenue"
    }

    // Test monthly balance/revenue columns (these are numeric)
    const monthlyBalanceColumns = mainCols.filter((col) => col.includes("Balance"));
    const monthlyRevenueColumns = mainCols.filter((col) => col.includes("Revenue"));

    if (monthlyBalanceColumns.length > 0) {
      await testColumnSorting(canvas, canvasElement, monthlyBalanceColumns[0]); // First monthly balance
    }

    if (monthlyRevenueColumns.length > 0) {
      await testColumnSorting(canvas, canvasElement, monthlyRevenueColumns[0]); // First monthly revenue
    }

    // Test 2: Sort persistence (only one column sorted at a time)
    if (pinnedLeftCols.length > 0 && mainCols.length > 0) {
      await testSortPersistence(
        canvas,
        canvasElement,
        pinnedLeftCols[0], // "Name" (pinned left)
        mainCols[0] // "Total Amount" (main)
      );
    }

    // Test 3: Cross-section sorting (pinned left → main → pinned right)
    // For billing example, we don't have pinned right columns, so we'll test pinned left → main
    if (pinnedLeftCols.length > 0 && mainCols.length > 1) {
      await testCrossSectionSorting(
        canvas,
        canvasElement,
        pinnedLeftCols[0], // "Name" (pinned left)
        mainCols[0], // "Total Amount" (main)
        mainCols[1] // "Deferred Revenue" (main - as substitute for pinned right)
      );
    }

    // Test 4: Rapid clicking stability
    if (monthlyBalanceColumns.length > 0) {
      await testRapidSortClicks(canvas, canvasElement, monthlyBalanceColumns[0]);
    }

    // Test 5: Data type sorting comprehensive test
    // For billing: Name (string), Total Amount (number), Balance (number)
    if (pinnedLeftCols.length > 0 && mainCols.length > 0 && monthlyBalanceColumns.length > 0) {
      await testDataTypeSorting(
        canvas,
        canvasElement,
        pinnedLeftCols[0], // "Name" (string)
        mainCols[0], // "Total Amount" (number)
        monthlyBalanceColumns[0] // First monthly balance (number - substitute for date)
      );
    }

    // Test 6: Additional individual column tests
    // Test a few more columns to ensure all sortable columns work
    const additionalColumns = [
      ...monthlyRevenueColumns.slice(0, 2), // Test first 2 revenue columns
      ...monthlyBalanceColumns.slice(1, 3), // Test next 2 balance columns
    ].filter(Boolean);

    for (const columnLabel of additionalColumns) {
      await testColumnSorting(canvas, canvasElement, columnLabel);
    }
  },
};
