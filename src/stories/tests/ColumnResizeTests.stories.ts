import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { within } from "@storybook/test";
import AlignmentExample, { alignmentExampleDefaults } from "../examples/AlignmentExample";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import { testColumnResize } from "../test-utils/columnResizeTestUtils";
import { waitForTable } from "../test-utils/commonTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Column Resize Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

export const ColumnResize: StoryObj<UniversalTableProps> = {
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

    // Test that all columns can be resized by 20px
    // and verify the width change for each column
    await testColumnResize(canvas, canvasElement);
  },
};
