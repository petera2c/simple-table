import { expect, within } from "@storybook/test";
import { waitForTableRender } from "./commonTestUtils";

/**
 * Column Resizing Test Utilities
 */

export const testResizeHandlesPresent = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle-container");
  expect(resizeHandles.length).toBeGreaterThan(0);

  resizeHandles.forEach((handle) => {
    const computedStyle = window.getComputedStyle(handle);
    expect(computedStyle.cursor).toBe("col-resize");
  });
};

export const testColumnResizing = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle-container");
  expect(resizeHandles.length).toBeGreaterThan(0);

  if (resizeHandles.length > 0) {
    const firstHandle = resizeHandles[0] as HTMLElement;
    const startX = firstHandle.getBoundingClientRect().left + 5;
    const endX = startX + 50;

    const mouseDownEvent = new MouseEvent("mousedown", {
      clientX: startX,
      clientY: firstHandle.getBoundingClientRect().top + 5,
      bubbles: true,
      cancelable: true,
    });

    const mouseMoveEvent = new MouseEvent("mousemove", {
      clientX: endX,
      clientY: firstHandle.getBoundingClientRect().top + 5,
      bubbles: true,
      cancelable: true,
    });

    const mouseUpEvent = new MouseEvent("mouseup", {
      clientX: endX,
      clientY: firstHandle.getBoundingClientRect().top + 5,
      bubbles: true,
      cancelable: true,
    });

    firstHandle.dispatchEvent(mouseDownEvent);
    document.dispatchEvent(mouseMoveEvent);
    document.dispatchEvent(mouseUpEvent);

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

export const testResizeHandleStyling = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle-container");
  expect(resizeHandles.length).toBeGreaterThan(0);

  resizeHandles.forEach((handle) => {
    expect(handle).toHaveClass("st-header-resize-handle-container");

    const innerHandle = handle.querySelector(".st-header-resize-handle");
    expect(innerHandle).toBeInTheDocument();
    expect(innerHandle).toHaveClass("st-header-resize-handle");

    const computedStyle = window.getComputedStyle(handle);
    expect(computedStyle.cursor).toBe("col-resize");
  });
};
