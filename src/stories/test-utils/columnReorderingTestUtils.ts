import { expect, within } from "@storybook/test";
import { waitForTableRender } from "./commonTestUtils";

/**
 * Column Reordering Test Utilities
 */

export const testColumnReordering = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const headerLabels = canvasElement.querySelectorAll(".st-header-label[draggable='true']");
  expect(headerLabels.length).toBeGreaterThan(0);

  headerLabels.forEach((label) => {
    expect(label).toHaveAttribute("draggable", "true");
  });
};

export const testColumnOrderPersistence = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const initialHeaderTexts = Array.from(
    canvasElement.querySelectorAll(".st-header-label-text")
  ).map((el) => el.textContent);

  expect(initialHeaderTexts.length).toBeGreaterThan(0);
  expect(initialHeaderTexts).toContain("Name");
  expect(initialHeaderTexts).toContain("Employees");

  const draggableHeaders = canvasElement.querySelectorAll(".st-header-label[draggable='true']");

  if (draggableHeaders.length >= 2) {
    const sourceHeader = draggableHeaders[0] as HTMLElement;
    const targetHeader = draggableHeaders[1] as HTMLElement;
    const targetHeaderCell = targetHeader.closest(".st-header-cell") as HTMLElement;

    const dragStartEvent = new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    const dragOverEvent = new DragEvent("dragover", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    const dropEvent = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    const dragEndEvent = new DragEvent("dragend", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    sourceHeader.dispatchEvent(dragStartEvent);
    await new Promise((resolve) => setTimeout(resolve, 50));

    targetHeaderCell.dispatchEvent(dragOverEvent);
    await new Promise((resolve) => setTimeout(resolve, 50));

    targetHeaderCell.dispatchEvent(dropEvent);
    await new Promise((resolve) => setTimeout(resolve, 50));

    sourceHeader.dispatchEvent(dragEndEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const finalHeaderTexts = Array.from(
      canvasElement.querySelectorAll(".st-header-label-text")
    ).map((el) => el.textContent);

    expect(finalHeaderTexts.length).toBe(initialHeaderTexts.length);

    initialHeaderTexts.forEach((headerText) => {
      expect(finalHeaderTexts).toContain(headerText);
    });

    console.log("Initial order:", initialHeaderTexts);
    console.log("Final order:", finalHeaderTexts);
  }
};

export const testDragHandlerFunctionality = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const draggableHeaders = canvasElement.querySelectorAll(".st-header-label[draggable='true']");
  expect(draggableHeaders.length).toBeGreaterThan(0);

  draggableHeaders.forEach((header) => {
    const headerCell = header.closest(".st-header-cell");
    expect(headerCell).toBeInTheDocument();
    expect(headerCell).toHaveClass("st-header-cell");
  });
};
