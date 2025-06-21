import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import { testFeatureIntegration } from "../test-utils/commonTestUtils";
import {
  testHeaderAlignment,
  testAlignmentPersistence,
  RETAIL_COLUMN_ALIGNMENTS,
} from "../test-utils/alignmentTestUtils";
import { testColumnResizing } from "../test-utils/columnResizeTestUtils";
import { testColumnOrderPersistence } from "../test-utils/columnReorderingTestUtils";
import { testColumnVisibility } from "../test-utils/columnVisibilityTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Feature Integration Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleFeatureCoexistence: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const features = await testFeatureIntegration(canvas, canvasElement);
    console.log("Available features:", features);
  },
};

export const ComplexInteractionWorkflow: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await testHeaderAlignment(canvas, RETAIL_COLUMN_ALIGNMENTS);

    const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle-container");
    if (resizeHandles.length > 0) {
      await testColumnResizing(canvas, canvasElement);
    }

    const draggableHeaders = canvasElement.querySelectorAll(".st-header-label[draggable='true']");
    if (draggableHeaders.length > 0) {
      await testColumnOrderPersistence(canvas, canvasElement);
    }

    const columnEditor = canvasElement.querySelector(".st-column-editor");
    if (columnEditor) {
      await testColumnVisibility(canvas, canvasElement);
    }

    await testHeaderAlignment(canvas, RETAIL_COLUMN_ALIGNMENTS);
  },
};

export const AlignmentThroughAllFeatures: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await testAlignmentPersistence(canvas, async () => {
      // Resize interaction
      const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle-container");
      if (resizeHandles.length > 0) {
        const firstHandle = resizeHandles[0] as HTMLElement;
        const startX = firstHandle.getBoundingClientRect().left + 5;
        const endX = startX + 20;

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

      // Reordering interaction
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

        targetHeaderCell.dispatchEvent(dropEvent);
        await new Promise((resolve) => setTimeout(resolve, 50));

        sourceHeader.dispatchEvent(dragEndEvent);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Visibility toggle interaction
      const columnEditor = canvasElement.querySelector(".st-column-editor");
      if (columnEditor) {
        const popout = canvasElement.querySelector(".st-column-editor-popout");
        if (popout) {
          const checkboxItems = popout.querySelectorAll(".st-header-checkbox-item");

          if (checkboxItems.length > 0) {
            const firstCheckboxItem = checkboxItems[0];
            const checkboxLabel = firstCheckboxItem.querySelector(".st-checkbox-label");

            if (checkboxLabel) {
              (checkboxLabel as HTMLElement).click();
              await new Promise((resolve) => setTimeout(resolve, 100));

              (checkboxLabel as HTMLElement).click();
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }
        }
      }

      // Scrolling interaction
      const scrollableContainer = canvasElement.querySelector(".st-body-main");
      if (scrollableContainer) {
        scrollableContainer.scrollLeft = 50;
        await new Promise((resolve) => setTimeout(resolve, 100));

        scrollableContainer.scrollLeft = 0;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    });
  },
};
