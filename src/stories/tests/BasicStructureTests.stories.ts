import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import AlignmentExample from "../examples/AlignmentExample";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import { alignmentExampleDefaults } from "../examples/AlignmentExample";
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

export const BasicDOMStructure: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...alignmentExampleDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: AlignmentExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);
  },
};
