import { expect, within } from "@storybook/test";
import {
  getMainColumns,
  getPinnedLeftColumns,
  getPinnedRightColumns,
  findHeaderCellByLabel,
} from "./commonTestUtils";

/**
 * Comprehensive column resize test that verifies width changes
 * for all columns by resizing each by 20px
 */
export const testColumnResize = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const resizeAmount = 20;

  // Get all columns from shared utilities
  const allColumns = [...getPinnedLeftColumns(), ...getMainColumns(), ...getPinnedRightColumns()];

  // Resize and verify each column immediately
  for (const column of allColumns) {
    const targetHeaderCell = findHeaderCellByLabel(canvasElement, column.label);

    if (targetHeaderCell) {
      // Get initial width
      const initialWidth = targetHeaderCell.getBoundingClientRect().width;

      const resizeHandle = targetHeaderCell.querySelector(
        ".st-header-resize-handle-container"
      ) as HTMLElement;

      if (resizeHandle) {
        const startX = resizeHandle.getBoundingClientRect().left + 5;

        // For right-pinned columns, drag in the opposite direction
        const isRightPinned = column.pinned === "right";
        const endX = isRightPinned ? startX - resizeAmount : startX + resizeAmount;

        const mouseDownEvent = new MouseEvent("mousedown", {
          clientX: startX,
          clientY: resizeHandle.getBoundingClientRect().top + 5,
          bubbles: true,
          cancelable: true,
        });

        const mouseMoveEvent = new MouseEvent("mousemove", {
          clientX: endX,
          clientY: resizeHandle.getBoundingClientRect().top + 5,
          bubbles: true,
          cancelable: true,
        });

        const mouseUpEvent = new MouseEvent("mouseup", {
          clientX: endX,
          clientY: resizeHandle.getBoundingClientRect().top + 5,
          bubbles: true,
          cancelable: true,
        });

        resizeHandle.dispatchEvent(mouseDownEvent);
        document.dispatchEvent(mouseMoveEvent);
        document.dispatchEvent(mouseUpEvent);

        await new Promise((resolve) => setTimeout(resolve, 100));

        // Verify immediately after resize
        const finalWidth = targetHeaderCell.getBoundingClientRect().width;
        const widthChange = finalWidth - initialWidth;

        // Allow for small tolerance due to browser rounding
        expect(Math.abs(widthChange - resizeAmount)).toBeLessThan(5);
      }
    }
  }
};
