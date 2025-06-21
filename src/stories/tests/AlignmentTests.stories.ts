import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import {
  testHeaderAlignment,
  testDataCellAlignment,
  testAlignmentPersistence,
  RETAIL_COLUMN_ALIGNMENTS,
} from "../test-utils/alignmentTestUtils";
import { waitForTableRender } from "../test-utils/commonTestUtils";

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

export const HeaderAlignment: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testHeaderAlignment(canvas, RETAIL_COLUMN_ALIGNMENTS);
  },
};

export const CellContentAlignment: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await waitForTableRender(canvas, canvasElement);
    await testDataCellAlignment(canvas, canvasElement, RETAIL_COLUMN_ALIGNMENTS);
  },
};

export const AlignmentAfterSorting: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testAlignmentPersistence(canvas, async () => {
      const sortableHeaders = canvasElement.querySelectorAll('.st-header-label[role="button"]');
      if (sortableHeaders.length > 0) {
        (sortableHeaders[0] as HTMLElement).click();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    });
  },
};

export const ResponsiveAlignment: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await waitForTableRender(canvas, canvasElement);

    const originalWidth = window.innerWidth;
    try {
      Object.defineProperty(window, "innerWidth", { value: 768, writable: true });
      window.dispatchEvent(new Event("resize"));
      await new Promise((resolve) => setTimeout(resolve, 100));
      await testHeaderAlignment(canvas, RETAIL_COLUMN_ALIGNMENTS);
    } finally {
      Object.defineProperty(window, "innerWidth", { value: originalWidth, writable: true });
      window.dispatchEvent(new Event("resize"));
    }
  },
};
