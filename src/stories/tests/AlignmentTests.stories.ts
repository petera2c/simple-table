import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { within } from "@storybook/test";
import AlignmentExample, { alignmentExampleDefaults } from "../examples/AlignmentExample";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import { testColumnAlignment } from "../test-utils/alignmentTestUtils";
import { waitForTable } from "../test-utils/commonTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Alignment Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

export const ColumnAlignment: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...alignmentExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: AlignmentExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Wait for table to render
    await waitForTable();

    // Test that all columns have correct CSS text-align properties
    // in both header cells and body cells
    await testColumnAlignment(canvas, canvasElement);
  },
};
