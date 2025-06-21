import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import { testColumnResize, waitForTable } from "../test-utils/columnResizeTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Column Resize Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnResize: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Wait for table to render
    await waitForTable();

    // Test that all columns can be resized by 20px
    // and verify the width change for each column
    await testColumnResize(canvas, canvasElement);
  },
};
