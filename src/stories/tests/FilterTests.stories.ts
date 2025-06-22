import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { FilterExampleComponent } from "../examples/filter-example/FilterExample";
import {
  testAllColumnFilters,
  testBasicColumnFilters,
  getFilterableColumnsFromHeaders,
} from "../test-utils/filterTestUtils";

const meta: Meta<typeof FilterExampleComponent> = {
  title: "Tests/Filter Tests",
  component: FilterExampleComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Comprehensive filter tests with multiple operators and expected row counts
 */
export const ComprehensiveFilterTests: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testAllColumnFilters(canvasElement);
    } catch (error) {
      throw error;
    }
  },
};
