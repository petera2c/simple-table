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
import { testAllCellEdits } from "../test-utils/cellEditTestUtils";

const meta: Meta<typeof FilterExampleComponent> = {
  title: "Tests/Cell Edit Tests",
  component: FilterExampleComponent,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

/**
 * Comprehensive cell editing tests for all editable column types
 */
export const ComprehensiveCellEditTests: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...filterExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: FilterExampleComponent, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testAllCellEdits(canvasElement);
    } catch (error) {
      throw error;
    }
  },
};
