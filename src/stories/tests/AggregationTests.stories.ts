import type { Meta, StoryObj } from "@storybook/react";
import RowGroupingExample from "../examples/row-grouping/RowGrouping";
import { testAllAggregationFunctions } from "../test-utils/aggregationTestUtils";

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
 * Includes basic table verification, hierarchical behavior, and collapsed row tests
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
