import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { within, expect, userEvent } from "@storybook/test";
import { useState } from "react";
import RowHeightExample, { rowHeightDefaults } from "../examples/RowHeightExample";
import StoryWrapper, {
  defaultUniversalArgs,
  universalArgTypes,
  UniversalTableProps,
} from "../examples/StoryWrapper";
import {
  testRowHeight,
  waitForTableWithRowHeight,
  getActualRowHeight,
} from "../test-utils/rowHeightTestUtils";

const meta: Meta<typeof RowHeightExample> = {
  title: "Tests/Row Height Tests",
  component: RowHeightExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

// Interactive component wrapper for testing
const InteractiveRowHeightTest = (args: UniversalTableProps) => {
  const [currentRowHeight, setCurrentRowHeight] = useState(30);

  return (
    <div>
      <div data-testid="controls" style={{ marginBottom: "1rem" }}>
        <button
          data-testid="increase-height"
          onClick={() => setCurrentRowHeight((prev) => Math.min(prev + 5, 60))}
          disabled={currentRowHeight >= 60}
        >
          Increase Height (+5px)
        </button>
        <button data-testid="reset-height" onClick={() => setCurrentRowHeight(30)}>
          Reset to 30px
        </button>
        <span data-testid="current-height" style={{ marginLeft: "1rem" }}>
          Current: {currentRowHeight}px
        </span>
      </div>
      <StoryWrapper 
        ExampleComponent={RowHeightExample} 
        {...args} 
        customTheme={{
          rowHeight: currentRowHeight,
          headerHeight: currentRowHeight,
        }}
      />
    </div>
  );
};

export const DynamicRowHeightTest: StoryObj<UniversalTableProps> = {
  args: {
    ...defaultUniversalArgs,
    ...rowHeightDefaults,
  },
  argTypes: universalArgTypes,
  render: InteractiveRowHeightTest,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Wait for initial render
    await waitForTableWithRowHeight();

    // Start with 30px and verify
    let expectedHeight = 30;
    await testRowHeight(canvasElement, expectedHeight);
    let actualHeight = getActualRowHeight(canvasElement);
    expect(actualHeight).toBe(expectedHeight);

    // Test increments from 30 to 60 in steps of 5
    while (expectedHeight < 60) {
      // Click the increase button
      const increaseButton = canvas.getByTestId("increase-height");
      await userEvent.click(increaseButton);

      // Update expected height
      expectedHeight += 5;

      // Wait for re-render
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify the DOM reflects the new height
      await testRowHeight(canvasElement, expectedHeight);
      actualHeight = getActualRowHeight(canvasElement);
      expect(actualHeight).toBe(expectedHeight);

      // Verify the display shows correct current height
      const currentHeightDisplay = canvas.getByTestId("current-height");
      expect(currentHeightDisplay.textContent).toBe(`Current: ${expectedHeight}px`);
    }

    // Final verification - button should be disabled at 60px
    const increaseButton = canvas.getByTestId("increase-height");
    expect(increaseButton).toBeDisabled();
  },
};
