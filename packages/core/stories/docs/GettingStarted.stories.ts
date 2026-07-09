/**
 * Docs & Examples / Getting Started
 */
import type { Meta, StoryObj } from "@storybook/html";
import { renderBasicExample, basicExampleDefaults } from "../examples/BasicExample";
import { storyArgs } from "./storyArgs";

const meta: Meta = {
  title: "Docs & Examples/Getting Started",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const BasicExample: StoryObj = {
  ...storyArgs(basicExampleDefaults),
  render: (args) => renderBasicExample(args),
  parameters: {
    docs: {
      description: {
        story:
          "Quick start demo: sortable, filterable columns with column resizing, reordering, and cell selection.",
      },
    },
  },
};
