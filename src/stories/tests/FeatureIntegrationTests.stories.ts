import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import { testFeatureIntegration, waitForTable } from "../test-utils/commonTestUtils";
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
  name: "Multiple Feature Coexistence Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await waitForTable();

    const features = await testFeatureIntegration(canvas, canvasElement);
    console.log("Available features:", features);
  },
};

export const ComplexInteractionWorkflow: Story = {
  name: "Complex Interaction Workflow Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await waitForTable();

    console.log("🚀 Starting complex interaction workflow");

    // Test resizing if available
    const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle-container");
    if (resizeHandles.length > 0) {
      console.log("Testing column resizing...");
      await testColumnResizing(canvas, canvasElement);
    }

    // Test reordering if available
    const draggableHeaders = canvasElement.querySelectorAll(".st-header-label[draggable='true']");
    if (draggableHeaders.length > 0) {
      console.log("Testing column reordering...");
      await testColumnOrderPersistence(canvas, canvasElement);
    }

    // Test visibility if available
    const columnEditor = canvasElement.querySelector(".st-column-editor");
    if (columnEditor) {
      console.log("Testing column visibility...");
      await testColumnVisibility(canvas, canvasElement);
    }

    console.log("✅ Complex interaction workflow completed");
  },
};

export const FeatureStabilityTests: Story = {
  name: "Feature Stability Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await waitForTable();

    console.log("🚀 Starting feature stability tests");

    // Test multiple interactions in sequence
    const interactions = [
      // Resize interaction
      async () => {
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
      },

      // Reordering interaction
      async () => {
        const draggableHeaders = canvasElement.querySelectorAll(
          ".st-header-label[draggable='true']"
        );
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
      },

      // Visibility toggle interaction
      async () => {
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
      },

      // Scrolling interaction
      async () => {
        const scrollableContainer = canvasElement.querySelector(".st-body-main");
        if (scrollableContainer) {
          scrollableContainer.scrollLeft = 50;
          await new Promise((resolve) => setTimeout(resolve, 100));

          scrollableContainer.scrollLeft = 0;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      },
    ];

    // Execute all interactions
    for (const interaction of interactions) {
      await interaction();
    }

    // Verify table is still functional after all interactions
    const tableRoot = canvasElement.querySelector(".simple-table-root");
    const headerContainer = canvasElement.querySelector(".st-header-container");
    const bodyContainer = canvasElement.querySelector(".st-body-container");

    expect(tableRoot).toBeInTheDocument();
    expect(headerContainer).toBeInTheDocument();
    expect(bodyContainer).toBeInTheDocument();

    console.log("✅ Feature stability tests completed");
  },
};
