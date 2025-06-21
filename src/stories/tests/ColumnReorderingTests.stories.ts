import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import {
  testColumnReordering,
  testColumnOrderPersistence,
  testDragHandlerFunctionality,
} from "../test-utils/columnReorderingTestUtils";
import { testAlignmentPersistence } from "../test-utils/alignmentTestUtils";

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

export const AlignmentAfterReordering: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testAlignmentPersistence(canvas, async () => {
      const draggableHeaders = canvasElement.querySelectorAll(".st-header-label[draggable='true']");

      if (draggableHeaders.length >= 2) {
        const sourceHeader = draggableHeaders[0] as HTMLElement;
        const targetHeader = draggableHeaders[1] as HTMLElement;
        const targetHeaderCell = targetHeader.closest(".st-header-cell") as HTMLElement;

        const dragStartEvent = new DragEvent("dragstart", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        });

        const dragOverEvent = new DragEvent("dragover", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        });

        const dropEvent = new DragEvent("drop", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        });

        const dragEndEvent = new DragEvent("dragend", {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        });

        sourceHeader.dispatchEvent(dragStartEvent);
        await new Promise((resolve) => setTimeout(resolve, 50));

        targetHeaderCell.dispatchEvent(dragOverEvent);
        await new Promise((resolve) => setTimeout(resolve, 50));

        targetHeaderCell.dispatchEvent(dropEvent);
        await new Promise((resolve) => setTimeout(resolve, 50));

        sourceHeader.dispatchEvent(dragEndEvent);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    });
  },
};
