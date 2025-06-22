import type { Meta, StoryObj } from "@storybook/react";
import AlignmentExample from "../examples/AlignmentExample";
import {
  testCellSelectionComprehensive,
  testSingleCellSelection,
  testMultiCellRangeSelection,
  testCellSelectionPersistence,
  testCellsAreClickable,
  clickCell,
  selectCellRange,
  isCellSelected,
  getSelectedCellCount,
  validateCellRangeSelection,
  clearCellSelection,
  logTableState,
} from "../test-utils/cellSelectionTestUtils";
import { expect } from "@storybook/test";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Cell Selection Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Comprehensive cell selection tests covering single cell selection,
 * multi-cell range selection, selection persistence, and visual validation
 */
export const ComprehensiveCellSelectionTests: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    console.log(`🚀 Starting Cell Selection Tests`);
    console.log(`📋 Canvas element:`, canvasElement);

    try {
      // Check initial table state
      console.log(`🔍 Initial table inspection:`);
      logTableState(canvasElement);

      // Run the comprehensive test suite
      console.log(`🧪 Running comprehensive test suite...`);
      await testCellSelectionComprehensive(canvasElement);

      // Additional specific tests with multiple expect statements

      // Test 1: Single cell selection with detailed validation
      console.log(`🧪 Test 1: Single cell selection`);
      await clearCellSelection(canvasElement);
      logTableState(canvasElement);

      await clickCell(canvasElement, 1, 1);
      logTableState(canvasElement);

      expect(isCellSelected(canvasElement, 1, 1)).toBe(true);
      expect(getSelectedCellCount(canvasElement)).toBe(1);

      // Test 2: Multi-cell range selection (3x3 grid) with border validation
      await clearCellSelection(canvasElement);
      await selectCellRange(canvasElement, 0, 0, 2, 2);

      // Validate all 9 cells are selected
      expect(getSelectedCellCount(canvasElement)).toBe(9);

      // Validate specific cells in the range
      expect(isCellSelected(canvasElement, 0, 0)).toBe(true);
      expect(isCellSelected(canvasElement, 0, 1)).toBe(true);
      expect(isCellSelected(canvasElement, 0, 2)).toBe(true);
      expect(isCellSelected(canvasElement, 1, 0)).toBe(true);
      expect(isCellSelected(canvasElement, 1, 1)).toBe(true);
      expect(isCellSelected(canvasElement, 1, 2)).toBe(true);
      expect(isCellSelected(canvasElement, 2, 0)).toBe(true);
      expect(isCellSelected(canvasElement, 2, 1)).toBe(true);
      expect(isCellSelected(canvasElement, 2, 2)).toBe(true);

      // Test that cells outside the range are not selected
      expect(isCellSelected(canvasElement, 3, 0)).toBe(false);
      expect(isCellSelected(canvasElement, 0, 3)).toBe(false);

      // Test 3: Different range selection (2x4 rectangle)
      await clearCellSelection(canvasElement);
      await selectCellRange(canvasElement, 1, 1, 2, 4);

      expect(getSelectedCellCount(canvasElement)).toBe(8); // 2 rows x 4 columns
      await validateCellRangeSelection(canvasElement, 1, 1, 2, 4);

      // Test 4: Selection replacement
      await clearCellSelection(canvasElement);
      await clickCell(canvasElement, 1, 1);
      expect(isCellSelected(canvasElement, 1, 1)).toBe(true);
      expect(getSelectedCellCount(canvasElement)).toBe(1);

      // Select a different cell - should replace the previous selection
      await clickCell(canvasElement, 3, 3);
      expect(isCellSelected(canvasElement, 1, 1)).toBe(false);
      expect(isCellSelected(canvasElement, 3, 3)).toBe(true);
      expect(getSelectedCellCount(canvasElement)).toBe(1);

      // Test 5: Verify cells are clickable
      await testCellsAreClickable(canvasElement);

      // Final cleanup
      await clearCellSelection(canvasElement);
      expect(getSelectedCellCount(canvasElement)).toBe(0);
    } catch (error) {
      console.error("Cell selection test failed:", error);
      throw error;
    }
  },
};
