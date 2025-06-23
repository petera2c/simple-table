import type { Meta, StoryObj } from "@storybook/react";
import { FilterExampleComponent } from "../examples/filter-example/FilterExample";
import { testAllCellEdits } from "../test-utils/cellEditTestUtils";

const meta: Meta<typeof FilterExampleComponent> = {
  title: "Tests/Cell Edit Tests",
  component: FilterExampleComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Comprehensive cell editing tests for all editable column types
 */
export const ComprehensiveCellEditTests: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testAllCellEdits(canvasElement);
    } catch (error) {
      throw error;
    }
  },
};
