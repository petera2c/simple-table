import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import {
  testColumnVisibility,
  testColumnEditorStructure,
  testVisibleColumnsShown,
} from "../test-utils/columnVisibilityTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Column Visibility Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnEditorStructure: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testColumnEditorStructure(canvas, canvasElement);
  },
};

export const ColumnVisibilityToggle: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testColumnVisibility(canvas, canvasElement);
  },
};

export const VisibleColumns: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const visibleColumns = ["name", "employees", "city", "totalSales"];
    await testVisibleColumnsShown(canvas, canvasElement, visibleColumns);
  },
};
