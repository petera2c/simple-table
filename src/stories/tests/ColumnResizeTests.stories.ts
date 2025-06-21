import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import {
  testResizeHandlesPresent,
  testColumnResizing,
  testResizeHandleStyling,
} from "../test-utils/columnResizeTestUtils";
import { testAlignmentPersistence } from "../test-utils/alignmentTestUtils";

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

export const ResizeHandlesPresent: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testResizeHandlesPresent(canvas, canvasElement);
  },
};

export const ColumnResizing: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testColumnResizing(canvas, canvasElement);
  },
};

export const ResizeHandleStyling: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testResizeHandleStyling(canvas, canvasElement);
  },
};

export const AlignmentAfterResize: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testAlignmentPersistence(canvas, async () => {
      const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle-container");
      if (resizeHandles.length > 0) {
        const firstHandle = resizeHandles[0] as HTMLElement;
        const startX = firstHandle.getBoundingClientRect().left + 5;
        const endX = startX + 30;

        const mouseDownEvent = new MouseEvent("mousedown", {
          clientX: startX,
          clientY: firstHandle.getBoundingClientRect().top + 5,
          bubbles: true,
          cancelable: true,
        });

        const mouseMoveEvent = new MouseEvent("mousemove", {
          clientX: endX,
          clientY: firstHandle.getBoundingClientRect().top + 5,
          bubbles: true,
          cancelable: true,
        });

        const mouseUpEvent = new MouseEvent("mouseup", {
          clientX: endX,
          clientY: firstHandle.getBoundingClientRect().top + 5,
          bubbles: true,
          cancelable: true,
        });

        firstHandle.dispatchEvent(mouseDownEvent);
        document.dispatchEvent(mouseMoveEvent);
        document.dispatchEvent(mouseUpEvent);

        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    });
  },
};
