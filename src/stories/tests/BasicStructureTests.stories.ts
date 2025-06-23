import type { Meta, StoryObj } from "@storybook/react";
import AlignmentExample from "../examples/AlignmentExample";
import { validateBasicTableStructure } from "../test-utils/commonTestUtils";

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
