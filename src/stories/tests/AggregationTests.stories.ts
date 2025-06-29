import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import RowGroupingExample, { rowGroupingDefaults } from "../examples/row-grouping/RowGrouping";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import { testAllAggregationFunctions } from "../test-utils/aggregationTestUtils";

const meta: Meta<typeof RowGroupingExample> = {
  title: "Tests/Aggregation Tests",
  component: RowGroupingExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

/**
 * Comprehensive aggregation tests for all aggregation functions
 * Includes basic table verification, hierarchical behavior, and collapsed row tests
 */
export const ComprehensiveAggregationTests: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...rowGroupingDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: RowGroupingExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testAllAggregationFunctions(canvasElement);
    } catch (error) {
      console.error("❌ Aggregation test failed:", error);
      throw error;
    }
  },
};
