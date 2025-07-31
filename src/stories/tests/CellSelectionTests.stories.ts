import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import AlignmentExample, { alignmentExampleDefaults } from "../examples/AlignmentExample";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import {
  testCellSelectionComprehensive,
  testCellsAreClickable,
  testColumnHeaderSelection,
  testCellSelectionAfterScroll,
  testRangeSelectionAfterScroll,
  clickCell,
  selectCellRange,
  isCellSelected,
  getSelectedCellCount,
  validateCellRangeSelection,
  clearCellSelection,
  clickColumnHeader,
  isColumnSelected,
  scrollTableVertically,
  findValidCellBounds,
} from "../test-utils/cellSelectionTestUtils";
import { expect } from "@storybook/test";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Cell Selection Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

/**
 * Comprehensive cell selection tests covering single cell selection,
 * multi-cell range selection, selection persistence, and visual validation
 */
export const ComprehensiveCellSelectionTests: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...alignmentExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: AlignmentExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      // Run the comprehensive test suite
      await testCellSelectionComprehensive(canvasElement);

      // Additional specific tests with multiple expect statements

      // Discover valid cell bounds for dynamic testing
      const bounds = findValidCellBounds(canvasElement);

      // Test 1: Single cell selection with detailed validation
      await clearCellSelection(canvasElement);

      await clickCell(canvasElement, bounds.minRow, bounds.minCol);

      expect(isCellSelected(canvasElement, bounds.minRow, bounds.minCol)).toBe(true);
      expect(getSelectedCellCount(canvasElement)).toBe(1);

      // Test 2: Multi-cell range selection with border validation
      await clearCellSelection(canvasElement);
      const testRangeEndRow = Math.min(bounds.minRow + 2, bounds.maxRow);
      const testRangeEndCol = Math.min(bounds.minCol + 2, bounds.maxCol);
      await selectCellRange(
        canvasElement,
        bounds.minRow,
        bounds.minCol,
        testRangeEndRow,
        testRangeEndCol
      );

      // Calculate expected cell count
      const expectedCells =
        (testRangeEndRow - bounds.minRow + 1) * (testRangeEndCol - bounds.minCol + 1);
      expect(getSelectedCellCount(canvasElement)).toBe(expectedCells);

      // Validate specific cells in the range
      for (let row = bounds.minRow; row <= testRangeEndRow; row++) {
        for (let col = bounds.minCol; col <= testRangeEndCol; col++) {
          expect(isCellSelected(canvasElement, row, col)).toBe(true);
        }
      }

      // Test that cells outside the range are not selected (if they exist)
      if (testRangeEndRow + 1 <= bounds.maxRow) {
        expect(isCellSelected(canvasElement, testRangeEndRow + 1, bounds.minCol)).toBe(false);
      }
      if (testRangeEndCol + 1 <= bounds.maxCol) {
        expect(isCellSelected(canvasElement, bounds.minRow, testRangeEndCol + 1)).toBe(false);
      }

      // Test 3: Different range selection
      await clearCellSelection(canvasElement);
      const altStartRow = Math.min(bounds.minRow + 1, bounds.maxRow);
      const altStartCol = Math.min(bounds.minCol + 1, bounds.maxCol);
      const altEndRow = Math.min(bounds.minRow + 2, bounds.maxRow);
      const altEndCol = Math.min(bounds.minCol + 3, bounds.maxCol);
      await selectCellRange(canvasElement, altStartRow, altStartCol, altEndRow, altEndCol);

      const altExpectedCells = (altEndRow - altStartRow + 1) * (altEndCol - altStartCol + 1);
      expect(getSelectedCellCount(canvasElement)).toBe(altExpectedCells);
      await validateCellRangeSelection(
        canvasElement,
        altStartRow,
        altStartCol,
        altEndRow,
        altEndCol
      );

      // Test 4: Selection replacement
      await clearCellSelection(canvasElement);
      await clickCell(canvasElement, bounds.minRow, bounds.minCol);
      expect(isCellSelected(canvasElement, bounds.minRow, bounds.minCol)).toBe(true);
      expect(getSelectedCellCount(canvasElement)).toBe(1);

      // Select a different cell - should replace the previous selection
      const differentRow = Math.min(bounds.minRow + 2, bounds.maxRow);
      const differentCol = Math.min(bounds.minCol + 2, bounds.maxCol);
      await clickCell(canvasElement, differentRow, differentCol);
      expect(isCellSelected(canvasElement, bounds.minRow, bounds.minCol)).toBe(false);
      expect(isCellSelected(canvasElement, differentRow, differentCol)).toBe(true);
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

/**
 * Test column header selection functionality
 */
export const ColumnHeaderSelectionTest: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...alignmentExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: AlignmentExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      // Test column header selection
      await testColumnHeaderSelection(canvasElement, 1);

      // Test clicking different column headers
      await clickColumnHeader(canvasElement, 2);
      expect(isColumnSelected(canvasElement, 2)).toBe(true);

      // Test header click on first column
      await clickColumnHeader(canvasElement, 0);
      expect(isColumnSelected(canvasElement, 0)).toBe(true);
    } catch (error) {
      console.error("Column header selection test failed:", error);
      throw error;
    }
  },
};

/**
 * Test cell selection functionality after scrolling
 */
export const ScrollAndSelectionTest: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...alignmentExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: AlignmentExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      // Test cell selection after scrolling
      await testCellSelectionAfterScroll(canvasElement, 300, 5, 1);

      // Test range selection after scrolling
      await testRangeSelectionAfterScroll(canvasElement, 200, 3, 1, 4, 3);

      // Test scrolling to different positions

      // Test 1: Scroll to 100px and find visible cells
      await scrollTableVertically(canvasElement, 100);
      const bounds100 = findValidCellBounds(canvasElement);
      await clickCell(canvasElement, bounds100.minRow, bounds100.minCol);
      expect(isCellSelected(canvasElement, bounds100.minRow, bounds100.minCol)).toBe(true);

      // Test 2: Scroll to 500px and find visible cells
      await scrollTableVertically(canvasElement, 500);
      const bounds500 = findValidCellBounds(canvasElement);
      await clickCell(canvasElement, bounds500.minRow, bounds500.minCol);
      expect(isCellSelected(canvasElement, bounds500.minRow, bounds500.minCol)).toBe(true);

      // Test 3: Scroll back to top and test selection
      await scrollTableVertically(canvasElement, 0);
      const scrollBounds = findValidCellBounds(canvasElement);
      await clickCell(canvasElement, scrollBounds.minRow, scrollBounds.minCol);
      expect(isCellSelected(canvasElement, scrollBounds.minRow, scrollBounds.minCol)).toBe(true);
    } catch (error) {
      console.error("Scroll and selection test failed:", error);
      throw error;
    }
  },
};
