import type { Meta, StoryObj } from "@storybook/react";
import RowGroupingExample from "../examples/row-grouping/RowGrouping";
import {
  testAllAggregationFunctions,
  testHierarchicalAggregation,
  testAggregationWithCollapsedRows,
} from "../test-utils/aggregationTestUtils";

const meta: Meta<typeof RowGroupingExample> = {
  title: "Tests/Aggregation Tests",
  component: RowGroupingExample,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Comprehensive aggregation tests for all aggregation functions
 */
export const ComprehensiveAggregationTests: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testAllAggregationFunctions(canvasElement);
    } catch (error) {
      console.error("❌ Aggregation test failed:", error);
      throw error;
    }
  },
};

/**
 * Test hierarchical aggregation behavior
 */
export const HierarchicalAggregationTests: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testHierarchicalAggregation(canvasElement);
    } catch (error) {
      console.error("❌ Hierarchical aggregation test failed:", error);
      throw error;
    }
  },
};

/**
 * Test aggregation with collapsed rows
 */
export const CollapsedRowAggregationTests: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testAggregationWithCollapsedRows(canvasElement);
    } catch (error) {
      console.error("❌ Collapsed row aggregation test failed:", error);
      throw error;
    }
  },
};
