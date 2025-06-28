import type { Meta, StoryObj } from "@storybook/react";
import LiveUpdatesExample from "../examples/LiveUpdates";
import { testLiveUpdates } from "../test-utils/liveUpdatesTestUtils";

const meta: Meta<typeof LiveUpdatesExample> = {
  title: "Tests/Live Updates Tests",
  component: LiveUpdatesExample,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Comprehensive live updates test with monitoring and assertions
 */
export const ComprehensiveLiveUpdatesTest: Story = {
  args: {
    height: "400px",
    theme: "light",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    try {
      await testLiveUpdates(canvasElement);
    } catch (error) {
      console.error("Live updates test failed:", error);
      throw error;
    }
  },
};
