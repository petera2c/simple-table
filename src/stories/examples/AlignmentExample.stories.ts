import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import AlignmentExample from "./AlignmentExample";
import {
  RETAIL_COLUMN_ALIGNMENTS,
  testHeaderAlignment,
  testDataCellAlignment,
  testAlignmentByType,
  testAlignmentPersistence,
  waitForTableRender,
} from "../test-utils/alignmentTestUtils";

const meta = {
  title: "Examples/Alignment",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Tests column alignment functionality - ensuring columns can be left, right, or center aligned based on their configuration.",
      },
    },
  },
} satisfies Meta<typeof AlignmentExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlignmentTests: Story = {
  name: "Column Alignment Tests",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitForTableRender(canvas, canvasElement);
    await testAlignmentByType(canvas);
  },
};

export const CellContentAlignmentTests: Story = {
  name: "Cell Content Alignment Tests",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitForTableRender(canvas, canvasElement);
    await testDataCellAlignment(canvas, canvasElement, RETAIL_COLUMN_ALIGNMENTS);
  },
};

export const ResponsiveAlignmentTests: Story = {
  name: "Responsive Alignment Tests",
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: "Mobile", styles: { width: "375px", height: "667px" } },
        tablet: { name: "Tablet", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "Desktop", styles: { width: "1200px", height: "800px" } },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitForTableRender(canvas, canvasElement);

    // Test that alignment is preserved across different viewport sizes
    const centerAlignedHeaders = canvas.getAllByText("Electronics Sales");
    const centerAlignedHeader = centerAlignedHeaders.find(
      (element: HTMLElement) =>
        element.closest(".st-header-container") &&
        element.classList.contains("st-header-label-text")
    );

    if (centerAlignedHeader) {
      const computedStyle = window.getComputedStyle(centerAlignedHeader);
      expect(computedStyle.textAlign).toBe("center");
    }

    // Test right alignment is preserved
    const rightAlignedHeaders = canvas.getAllByText("Employees");
    const rightAlignedHeader = rightAlignedHeaders.find(
      (element: HTMLElement) =>
        element.closest(".st-header-container") &&
        element.classList.contains("st-header-label-text")
    );

    if (rightAlignedHeader) {
      const computedStyle = window.getComputedStyle(rightAlignedHeader);
      expect(computedStyle.textAlign).toBe("right");
    }
  },
};

export const InteractiveAlignmentTests: Story = {
  name: "Interactive Alignment Tests",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitForTableRender(canvas, canvasElement);

    // Test sorting maintains alignment
    await testAlignmentPersistence(canvas, async () => {
      const sortableHeaders = canvas.getAllByText("Employees");
      const sortableHeader = sortableHeaders.find(
        (element: HTMLElement) =>
          element.closest(".st-header-container") &&
          element.classList.contains("st-header-label-text")
      );

      if (sortableHeader) {
        await userEvent.click(sortableHeader);
      }

      // Wait for sort to complete
      await waitFor(() => {
        const tableRoot = canvasElement.querySelector(".simple-table-root");
        expect(tableRoot).toBeInTheDocument();
      });
    });

    // Test that column resizing maintains alignment (if resize handles exist)
    const resizeHandles = canvas.queryAllByTestId(/resize-handle|column-resize/);
    if (resizeHandles.length > 0) {
      await testAlignmentPersistence(canvas, async () => {
        const firstResizeHandle = resizeHandles[0];
        await userEvent.hover(firstResizeHandle);
      });
    }
  },
};
