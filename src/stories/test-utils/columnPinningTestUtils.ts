import { expect, within } from "@storybook/test";
import { testThreeSectionLayout } from "./commonTestUtils";

/**
 * Column Pinning Test Utilities
 */

export const testPinnedLeftColumns = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  pinnedLeftAccessors: string[]
) => {
  const pinnedLeftContainer = canvasElement.querySelector(".st-header-pinned-left");
  if (pinnedLeftContainer && pinnedLeftAccessors.length > 0) {
    expect(pinnedLeftContainer).toBeInTheDocument();

    pinnedLeftAccessors.forEach((accessor) => {
      const headerCell = pinnedLeftContainer.querySelector(`[data-accessor="${accessor}"]`);
      expect(headerCell).toBeInTheDocument();
    });
  }
};

export const testPinnedRightColumns = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  pinnedRightAccessors: string[]
) => {
  const pinnedRightContainer = canvasElement.querySelector(".st-header-pinned-right");
  if (pinnedRightContainer && pinnedRightAccessors.length > 0) {
    expect(pinnedRightContainer).toBeInTheDocument();

    pinnedRightAccessors.forEach((accessor) => {
      const headerCell = pinnedRightContainer.querySelector(`[data-accessor="${accessor}"]`);
      expect(headerCell).toBeInTheDocument();
    });
  }
};

export const testMainColumns = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  mainColumnAccessors: string[]
) => {
  const mainContainer = canvasElement.querySelector(".st-header-main");
  if (mainContainer && mainColumnAccessors.length > 0) {
    expect(mainContainer).toBeInTheDocument();

    mainColumnAccessors.forEach((accessor) => {
      const headerCell =
        mainContainer.querySelector(`[data-accessor="${accessor}"]`) ||
        canvasElement.querySelector(`[data-accessor="${accessor}"]`);
      expect(headerCell).toBeInTheDocument();
    });
  }
};

export const testColumnPinningLayout = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  const headerContainer = canvasElement.querySelector(".st-header-container");
  const bodyContainer = canvasElement.querySelector(".st-body-container");

  expect(headerContainer).toBeInTheDocument();
  expect(bodyContainer).toBeInTheDocument();

  const headerMain = headerContainer?.querySelector(".st-header-main");
  const bodyMain = bodyContainer?.querySelector(".st-body-main");

  expect(headerMain).toBeInTheDocument();
  expect(bodyMain).toBeInTheDocument();

  const pinnedLeftHeader = headerContainer?.querySelector(".st-header-pinned-left");
  const pinnedRightHeader = headerContainer?.querySelector(".st-header-pinned-right");
  const pinnedLeftBody = bodyContainer?.querySelector(".st-body-pinned-left");
  const pinnedRightBody = bodyContainer?.querySelector(".st-body-pinned-right");

  if (pinnedLeftHeader) {
    expect(pinnedLeftHeader).toHaveClass("st-header-pinned-left");
  }
  if (pinnedRightHeader) {
    expect(pinnedRightHeader).toHaveClass("st-header-pinned-right");
  }
  if (pinnedLeftBody) {
    expect(pinnedLeftBody).toHaveClass("st-body-pinned-left");
  }
  if (pinnedRightBody) {
    expect(pinnedRightBody).toHaveClass("st-body-pinned-right");
  }
};

export const testComprehensivePinning = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  pinnedLeftAccessors: string[] = [],
  pinnedRightAccessors: string[] = [],
  mainColumnAccessors: string[] = []
) => {
  await testThreeSectionLayout(canvas, canvasElement);

  if (pinnedLeftAccessors.length > 0) {
    await testPinnedLeftColumns(canvas, canvasElement, pinnedLeftAccessors);
  }

  if (pinnedRightAccessors.length > 0) {
    await testPinnedRightColumns(canvas, canvasElement, pinnedRightAccessors);
  }

  if (mainColumnAccessors.length > 0) {
    await testMainColumns(canvas, canvasElement, mainColumnAccessors);
  }

  await testColumnPinningLayout(canvas, canvasElement);
};
