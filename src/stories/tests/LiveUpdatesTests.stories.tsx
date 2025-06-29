import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import LiveUpdatesExample, { liveUpdatesDefaults } from "../examples/LiveUpdates";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import { testLiveUpdates } from "../test-utils/liveUpdatesTestUtils";

const meta: Meta<typeof LiveUpdatesExample> = {
  title: "Tests/Live Updates Tests",
  component: LiveUpdatesExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

/**
 * Comprehensive live updates test with monitoring and assertions
 */
export const ComprehensiveLiveUpdatesTest: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...liveUpdatesDefaults,
  },
  argTypes: universalArgTypes,
  render: (args) =>
    React.createElement(StoryWrapper, { ExampleComponent: LiveUpdatesExample, ...args }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testLiveUpdates(canvasElement);
    } catch (error) {
      console.error("Live updates test failed:", error);
      throw error;
    }
  },
};
