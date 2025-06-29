import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  FilterExampleComponent,
  filterExampleDefaults,
} from "../examples/filter-example/FilterExample";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import { testAllColumnFilters } from "../test-utils/filterTestUtils";

const meta: Meta<typeof FilterExampleComponent> = {
  title: "Tests/Filter Tests",
  component: FilterExampleComponent,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

/**
 * Comprehensive filter tests with multiple operators and expected row counts
 */
export const ComprehensiveFilterTests: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...filterExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: FilterExampleComponent, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testAllColumnFilters(canvasElement);
    } catch (error) {
      throw error;
    }
  },
};
