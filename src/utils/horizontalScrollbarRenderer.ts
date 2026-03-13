// Vanilla JS horizontal scrollbar renderer
// Replaces TableHorizontalScrollbar.tsx React component

import type { SectionScrollController } from "../managers/SectionScrollController";
import { COLUMN_EDIT_WIDTH, PINNED_BORDER_WIDTH } from "../consts/general-consts";

export interface HorizontalScrollbarProps {
  mainBodyRef: HTMLDivElement;
  mainBodyWidth: number;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  pinnedLeftContentWidth: number;
  pinnedRightContentWidth: number;
  tableBodyContainerRef: HTMLDivElement;
  editColumns: boolean;
  sectionScrollController?: SectionScrollController | null;
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
    editColumns,
    sectionScrollController,
  } = props;

  // Check if horizontal scrolling is needed
  const clientWidth = mainBodyRef.clientWidth;
  const scrollWidth = mainBodyRef.scrollWidth;
  const threshold = 1;
  const isScrollable = scrollWidth - clientWidth > threshold;

  if (!isScrollable) {
    return null;
  }

  // Calculate widths
  const isContentVerticalScrollable =
    tableBodyContainerRef.scrollHeight > tableBodyContainerRef.clientHeight;
  const scrollbarWidth = isContentVerticalScrollable
    ? tableBodyContainerRef.offsetWidth - tableBodyContainerRef.clientWidth
    : 0;
  const editorWidth = editColumns ? COLUMN_EDIT_WIDTH : 0;
  const rightSectionWidth =
    (editColumns ? pinnedRightWidth + PINNED_BORDER_WIDTH : pinnedRightWidth) + scrollbarWidth;

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
    sectionScrollController?.registerPane("pinned-left", leftSection, "scrollbar");
  }

  // Create main section
  if (mainBodyWidth > 0) {
    const mainSection = document.createElement("div");
    mainSection.className = "st-horizontal-scrollbar-middle";

    const mainInner = document.createElement("div");
    mainInner.style.width = `${mainBodyWidth}px`;
    mainSection.appendChild(mainInner);

    container.appendChild(mainSection);
    sectionScrollController?.registerPane("main", mainSection, "scrollbar");
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
    sectionScrollController?.registerPane("pinned-right", rightSection, "scrollbar");
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

export const cleanupHorizontalScrollbar = (
  container: HTMLElement,
  sectionScrollController?: SectionScrollController | null,
): void => {
  if (sectionScrollController) {
    const leftSection = container.querySelector(".st-horizontal-scrollbar-left");
    const mainSection = container.querySelector(".st-horizontal-scrollbar-middle");
    const rightSection = container.querySelector(".st-horizontal-scrollbar-right");

    if (leftSection instanceof HTMLElement) {
      sectionScrollController.unregisterPane("pinned-left", leftSection);
    }
    if (mainSection instanceof HTMLElement) {
      sectionScrollController.unregisterPane("main", mainSection);
    }
    if (rightSection instanceof HTMLElement) {
      sectionScrollController.unregisterPane("pinned-right", rightSection);
    }
  }

  container.remove();
};
