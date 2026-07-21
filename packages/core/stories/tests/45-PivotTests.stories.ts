/**
 * Interaction tests for declarative matrix pivot.
 */
import type { Meta, StoryObj } from "@storybook/html";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderPivotExample, pivotExampleDefaults } from "../examples/PivotExample";

const meta: Meta = {
  title: "Tests/45 - Pivot",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const PivotRendersDynamicColumns: Story = {
  render: () => renderPivotExample(pivotExampleDefaults),
  play: async ({ canvasElement }) => {
    await waitForTable(canvasElement);
    const labels = Array.from(canvasElement.querySelectorAll(".st-header-label-text")).map(
      (el) => el.textContent ?? ""
    );
    expect(labels).toContain("Region");
    expect(labels).toContain("Q1");
    expect(labels).toContain("Q2");
    expect(labels).toContain("Total");
  },
};
