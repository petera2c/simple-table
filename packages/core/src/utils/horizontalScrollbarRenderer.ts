// Vanilla JS horizontal scrollbar renderer
// Replaces TableHorizontalScrollbar.tsx React component

import type { HorizontalScrollEngine } from "../managers/horizontalScroll";
import { COLUMN_EDIT_WIDTH, PINNED_BORDER_WIDTH } from "../consts/general-consts";

export interface HorizontalScrollbarProps {
  mainBodyRef: HTMLDivElement;
  mainBodyWidth: number;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  pinnedLeftContentWidth: number;
  pinnedRightContentWidth: number;
  tableBodyContainerRef: HTMLDivElement;
  /** True when the column-editor toggle strip is visible and reserves horizontal space. */
  enableColumnEditor: boolean;
  horizontalScroll?: HorizontalScrollEngine | null;
  /**
   * When true, skip the column-width overflow check and always build the bar.
   */
  forceScrollable?: boolean;
}

export const createHorizontalScrollbar = (
  props: HorizontalScrollbarProps,
): HTMLElement | null => {
  const {
    mainBodyRef,
    mainBodyWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    pinnedLeftContentWidth,
    pinnedRightContentWidth,
    tableBodyContainerRef,
    enableColumnEditor,
    horizontalScroll,
    forceScrollable = false,
  } = props;

  if (!forceScrollable) {
    const clientWidth = mainBodyRef.clientWidth;
    if (mainBodyWidth - clientWidth <= 1) {
      return null;
    }
  }

  // Calculate widths
  const isContentVerticalScrollable =
    tableBodyContainerRef.scrollHeight > tableBodyContainerRef.clientHeight;
  const scrollbarWidth = isContentVerticalScrollable
    ? tableBodyContainerRef.offsetWidth - tableBodyContainerRef.clientWidth
    : 0;
  const editorWidth = enableColumnEditor ? COLUMN_EDIT_WIDTH : 0;
  const rightSectionWidth =
    (enableColumnEditor ? pinnedRightWidth + PINNED_BORDER_WIDTH : pinnedRightWidth) + scrollbarWidth;

  // Create container
  const container = document.createElement("div");
  container.className = "st-horizontal-scrollbar-container";

  // Create left section
  if (pinnedLeftWidth > 0) {
    const leftSection = document.createElement("div");
    leftSection.className = "st-horizontal-scrollbar-left";
    leftSection.style.width = `${pinnedLeftWidth}px`;

    const leftInner = document.createElement("div");
    leftInner.style.width = `${pinnedLeftContentWidth}px`;
    leftSection.appendChild(leftInner);

    container.appendChild(leftSection);
    horizontalScroll?.registerPane("pinned-left", leftSection, "scrollbar");
  }

  // Create main section
  if (mainBodyWidth > 0) {
    const mainSection = document.createElement("div");
    mainSection.className = "st-horizontal-scrollbar-middle";

    const mainInner = document.createElement("div");
    mainInner.style.width = `${mainBodyWidth}px`;
    mainSection.appendChild(mainInner);

    container.appendChild(mainSection);
    horizontalScroll?.registerPane("main", mainSection, "scrollbar");
  }

  // Create right section
  if (pinnedRightWidth > 0) {
    const rightSection = document.createElement("div");
    rightSection.className = "st-horizontal-scrollbar-right";
    rightSection.style.width = `${rightSectionWidth}px`;

    const rightInner = document.createElement("div");
    rightInner.style.width = `${pinnedRightContentWidth}px`;
    rightSection.appendChild(rightInner);

    container.appendChild(rightSection);
    horizontalScroll?.registerPane("pinned-right", rightSection, "scrollbar");
  }

  // Create editor spacer
  if (editorWidth > 0) {
    const spacer = document.createElement("div");
    spacer.style.width = `${editorWidth - 1.5}px`;
    spacer.style.height = "100%";
    spacer.style.flexShrink = "0";
    container.appendChild(spacer);
  }

  return container;
};

/**
 * Apply width props to an existing scrollbar from {@link createHorizontalScrollbar}.
 * Used when layout is recreated without tearing down the DOM node (e.g. pinned resize).
 */
export const syncHorizontalScrollbarLayout = (
  container: HTMLElement,
  props: HorizontalScrollbarProps,
): void => {
  const {
    mainBodyWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    pinnedLeftContentWidth,
    pinnedRightContentWidth,
    tableBodyContainerRef,
    enableColumnEditor,
  } = props;

  const isContentVerticalScrollable =
    tableBodyContainerRef.scrollHeight > tableBodyContainerRef.clientHeight;
  const scrollbarWidth = isContentVerticalScrollable
    ? tableBodyContainerRef.offsetWidth - tableBodyContainerRef.clientWidth
    : 0;
  const editorWidth = enableColumnEditor ? COLUMN_EDIT_WIDTH : 0;
  const rightSectionWidth =
    (enableColumnEditor ? pinnedRightWidth + PINNED_BORDER_WIDTH : pinnedRightWidth) + scrollbarWidth;

  const leftSection = container.querySelector(
    ".st-horizontal-scrollbar-left",
  ) as HTMLElement | null;
  const leftInner = leftSection?.firstElementChild as HTMLElement | null;
  if (pinnedLeftWidth > 0 && leftSection && leftInner) {
    leftSection.style.width = `${pinnedLeftWidth}px`;
    leftInner.style.width = `${pinnedLeftContentWidth}px`;
  }

  const mainSection = container.querySelector(
    ".st-horizontal-scrollbar-middle",
  ) as HTMLElement | null;
  const mainInner = mainSection?.firstElementChild as HTMLElement | null;
  if (mainBodyWidth > 0 && mainSection && mainInner) {
    mainInner.style.width = `${mainBodyWidth}px`;
  }

  const rightSection = container.querySelector(
    ".st-horizontal-scrollbar-right",
  ) as HTMLElement | null;
  const rightInner = rightSection?.firstElementChild as HTMLElement | null;
  if (pinnedRightWidth > 0 && rightSection && rightInner) {
    rightSection.style.width = `${rightSectionWidth}px`;
    rightInner.style.width = `${pinnedRightContentWidth}px`;
  }

  if (editorWidth > 0) {
    const spacer = Array.from(container.children).find(
      (c) =>
        c instanceof HTMLElement &&
        !c.classList.contains("st-horizontal-scrollbar-left") &&
        !c.classList.contains("st-horizontal-scrollbar-middle") &&
        !c.classList.contains("st-horizontal-scrollbar-right"),
    ) as HTMLElement | undefined;
    if (spacer) {
      spacer.style.width = `${editorWidth - 1.5}px`;
    }
  }
};

export const cleanupHorizontalScrollbar = (
  container: HTMLElement,
  horizontalScroll?: HorizontalScrollEngine | null,
): void => {
  if (horizontalScroll) {
    const leftSection = container.querySelector(".st-horizontal-scrollbar-left");
    const mainSection = container.querySelector(".st-horizontal-scrollbar-middle");
    const rightSection = container.querySelector(".st-horizontal-scrollbar-right");

    if (leftSection instanceof HTMLElement) {
      horizontalScroll.unregisterPane("pinned-left", leftSection);
    }
    if (mainSection instanceof HTMLElement) {
      horizontalScroll.unregisterPane("main", mainSection);
    }
    if (rightSection instanceof HTMLElement) {
      horizontalScroll.unregisterPane("pinned-right", rightSection);
    }
  }

  container.remove();
};
