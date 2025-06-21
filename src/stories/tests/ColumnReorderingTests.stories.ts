import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import { testColumnReordering, waitForTable } from "../test-utils/columnReorderingTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Column Reordering Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnReordering: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Wait for table to render
    await waitForTable();

    // Test dragging Name column over City column
    // and verify that City becomes first, Name becomes second
    await testColumnReordering(canvas, canvasElement);
  },
};
