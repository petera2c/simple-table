import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import {
  testColumnReordering,
  testColumnOrderPersistence,
  testDragHandlerFunctionality,
} from "../test-utils/columnReorderingTestUtils";

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

export const DraggableHeaders: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testColumnReordering(canvas, canvasElement);
  },
};

export const ColumnReordering: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testColumnOrderPersistence(canvas, canvasElement);
  },
};

export const DragHandlerFunctionality: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testDragHandlerFunctionality(canvas, canvasElement);
  },
};
