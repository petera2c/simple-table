import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import { validateBasicTableStructure, testFeatureIntegration } from "../test-utils/commonTestUtils";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Basic Structure Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicDOMStructure: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);
  },
};

export const FeatureCoexistence: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const features = await testFeatureIntegration(canvas, canvasElement);
    console.log("Available features:", features);
  },
};
