import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import {
  testMainColumns,
  testColumnPinningLayout,
  testComprehensivePinning,
} from "../test-utils/columnPinningTestUtils";
import { testThreeSectionLayout } from "../test-utils/commonTestUtils";

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
