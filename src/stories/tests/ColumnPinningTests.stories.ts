import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import {
  testMainColumns,
  testColumnPinningLayout,
  testComprehensivePinning,
} from "../test-utils/columnPinningTestUtils";
import { testThreeSectionLayout } from "../test-utils/commonTestUtils";
import { testAlignmentPersistence } from "../test-utils/alignmentTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Column Pinning Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PinningLayoutStructure: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testThreeSectionLayout(canvas, canvasElement);
  },
};

export const ColumnPinningLayout: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testColumnPinningLayout(canvas, canvasElement);
  },
};

export const MainColumns: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const mainColumns = ["name", "city", "employees", "squareFootage"];
    await testMainColumns(canvas, canvasElement, mainColumns);
  },
};

export const ComprehensivePinning: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const pinnedLeft: string[] = [];
    const pinnedRight: string[] = [];
    const mainColumns = [
      "name",
      "city",
      "employees",
      "squareFootage",
      "openingDate",
      "customerRating",
    ];

    await testComprehensivePinning(canvas, canvasElement, pinnedLeft, pinnedRight, mainColumns);
  },
};

export const AlignmentWithPinning: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testAlignmentPersistence(canvas, async () => {
      const scrollableContainer = canvasElement.querySelector(".st-body-main");
      if (scrollableContainer) {
        scrollableContainer.scrollLeft = 100;
        await new Promise((resolve) => setTimeout(resolve, 100));

        scrollableContainer.scrollLeft = 0;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    });
  },
};
