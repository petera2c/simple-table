import type { Meta, StoryObj } from "@storybook/react";

import { SampleTable } from "./SimpleTableExample";

const meta = {
  title: "Example/Page",
  component: SampleTable,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SampleTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleTable: Story = {};
