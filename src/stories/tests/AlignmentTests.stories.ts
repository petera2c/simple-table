import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import { testColumnAlignment, waitForTable } from "../test-utils/alignmentTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Alignment Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnAlignment: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Wait for table to render
    await waitForTable();

    // Test that all columns have correct CSS text-align properties
    // in both header cells and body cells
    await testColumnAlignment(canvas, canvasElement);
  },
};
