import { expect, within } from "@storybook/test";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

/**
 * Simple wait function for table rendering
 */
export const waitForTable = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Comprehensive column resize test that verifies width changes
 * for all columns by resizing each by 20px
 */
export const testColumnResize = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  console.log("Testing column resize...");

  const resizeAmount = 20;

  // Resize and verify each column immediately
  for (const column of RETAIL_SALES_HEADERS) {
    const headerElements = canvasElement.querySelectorAll(".st-header-label-text");
    let targetHeaderCell: HTMLElement | null = null;

    // Find the column header
    for (const element of Array.from(headerElements)) {
      if (element.textContent?.trim() === column.label) {
        targetHeaderCell = element.closest(".st-header-cell") as HTMLElement;
        break;
      }
    }

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

  console.log("Column resize test completed successfully");
};
