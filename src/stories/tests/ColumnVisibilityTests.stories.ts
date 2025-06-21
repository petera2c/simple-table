import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import {
  testColumnVisibility,
  testColumnEditorStructure,
  testVisibleColumnsShown,
} from "../test-utils/columnVisibilityTestUtils";
import { testAlignmentPersistence } from "../test-utils/alignmentTestUtils";

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

export const AlignmentAfterVisibility: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await testAlignmentPersistence(canvas, async () => {
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
    });
  },
};
