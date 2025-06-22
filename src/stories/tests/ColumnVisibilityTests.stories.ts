import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";
import {
  testColumnEditorStructure,
  testHideMultipleColumns,
  testShowSpecificColumns,
  testVisibleColumnsShown,
  testHiddenColumnsNotVisible,
} from "../test-utils/columnVisibilityTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Column Visibility Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component: "Tests for column visibility functionality using the column editor panel",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper functions to get columns dynamically
const getMainColumns = () => RETAIL_SALES_HEADERS.filter((h) => !h.pinned).map((h) => h.label);
const getPinnedLeftColumns = () =>
  RETAIL_SALES_HEADERS.filter((h) => h.pinned === "left").map((h) => h.label);
const getPinnedRightColumns = () =>
  RETAIL_SALES_HEADERS.filter((h) => h.pinned === "right").map((h) => h.label);

/**
 * Comprehensive column visibility test with multiple interactions
 */
export const ComprehensiveColumnVisibilityTest: Story = {
  name: "Column Visibility - Comprehensive Test",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Get column groups dynamically
    const mainCols = getMainColumns();
    const pinnedLeftCols = getPinnedLeftColumns();
    const pinnedRightCols = getPinnedRightColumns();

    // Test 1: Verify editor structure
    await testColumnEditorStructure(canvas, canvasElement);

    // Test 2: Hide multiple columns (mix from different sections)
    const columnsToHide = [
      pinnedLeftCols[1], // "City"
      mainCols[1], // "Square Footage"
      mainCols[3], // "Customer Rating"
      mainCols[5], // "Clothing Sales"
    ].filter(Boolean); // Remove any undefined values

    await testHideMultipleColumns(canvas, canvasElement, columnsToHide);

    // Test 3: Verify hidden columns are not visible
    await testHiddenColumnsNotVisible(canvas, canvasElement, columnsToHide);

    // Test 4: Show some columns back
    const columnsToShow = [
      pinnedLeftCols[1], // "City"
      mainCols[3], // "Customer Rating"
    ].filter(Boolean);

    await testShowSpecificColumns(canvas, canvasElement, columnsToShow);

    // Test 5: Verify shown columns are visible
    await testVisibleColumnsShown(canvas, canvasElement, columnsToShow);

    // Test 6: Verify remaining hidden columns are still hidden
    const stillHidden = [
      mainCols[1], // "Square Footage"
      mainCols[5], // "Clothing Sales"
    ].filter(Boolean);

    await testHiddenColumnsNotVisible(canvas, canvasElement, stillHidden);
  },
};
