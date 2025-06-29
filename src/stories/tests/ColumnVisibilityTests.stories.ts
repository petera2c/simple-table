import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { within } from "@storybook/test";
import AlignmentExample, { alignmentExampleDefaults } from "../examples/AlignmentExample";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import { getMainColumnLabels, getPinnedLeftColumnLabels } from "../test-utils/commonTestUtils";
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

/**
 * Comprehensive column visibility test with multiple interactions
 */
export const ComprehensiveColumnVisibilityTest: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...alignmentExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: AlignmentExample, ...args }),
  name: "Column Visibility - Comprehensive Test",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Get column groups dynamically
    const mainCols = getMainColumnLabels();
    const pinnedLeftCols = getPinnedLeftColumnLabels();

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
