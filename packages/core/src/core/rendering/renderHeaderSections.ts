import { HeaderRenderContext } from "../../utils/headerCellRenderer";
import { canDisplaySection } from "../../utils/generalUtils";
import { SectionRenderer } from "./SectionRenderer";
import type { TableRendererDeps } from "./TableRendererDeps";
import type { SectionWidths } from "./cellRenderContexts";

export const renderHeaderSections = (args: {
  container: HTMLElement;
  calculatedHeaderHeight: number;
  maxHeaderDepth: number;
  deps: TableRendererDeps;
  headerContext: HeaderRenderContext;
  widths: SectionWidths;
  sectionRenderer: SectionRenderer;
}): void => {
  const { container, calculatedHeaderHeight, maxHeaderDepth, deps, headerContext, widths, sectionRenderer } =
    args;

  if (!container || deps.config.hideHeader) return;

  container.style.height = `${calculatedHeaderHeight}px`;

  const hasAnyVisibleSection =
    canDisplaySection(deps.effectiveHeaders, "left") ||
    canDisplaySection(deps.effectiveHeaders, undefined) ||
    canDisplaySection(deps.effectiveHeaders, "right");
  container.style.minHeight = hasAnyVisibleSection ? "" : `${calculatedHeaderHeight}px`;

  const gridElement = container.parentElement;
  if (gridElement) {
    gridElement.setAttribute("aria-rowcount", String(1 + deps.localRows.length));
    gridElement.setAttribute("aria-colcount", String(deps.effectiveHeaders.length));
    if (deps.config.enableRowSelection) {
      const multi = (deps.config.rowSelectionMode ?? "multiple") === "multiple";
      gridElement.setAttribute("aria-multiselectable", multi ? "true" : "false");
    } else {
      gridElement.removeAttribute("aria-multiselectable");
    }
  }

  const scrollLeftFor = (pinned?: "left" | "right") =>
    deps.horizontalScroll?.getSectionScrollLeft(
      pinned === "left" ? "pinned-left" : pinned === "right" ? "pinned-right" : "main",
    ) ?? 0;

  const pinnedLeftHeaders = deps.effectiveHeaders.filter((h) => h.pinned === "left");
  const mainHeaders = deps.effectiveHeaders.filter((h) => !h.pinned);
  const pinnedRightHeaders = deps.effectiveHeaders.filter((h) => h.pinned === "right");

  let currentColIndex = 0;
  const sectionsToKeep: HTMLElement[] = [];

  // Drop a leftover header strip that now has no columns.
  if (pinnedLeftHeaders.length === 0 && sectionRenderer.releaseHeaderSection("left")) {
    deps.pinnedLeftHeaderRef.current = null;
  }
  if (mainHeaders.length === 0 && sectionRenderer.releaseHeaderSection("main")) {
    deps.mainHeaderRef.current = null;
  }
  if (pinnedRightHeaders.length === 0 && sectionRenderer.releaseHeaderSection("right")) {
    deps.pinnedRightHeaderRef.current = null;
  }

  if (pinnedLeftHeaders.length > 0) {
    const leftSection = sectionRenderer.renderHeaderSection({
      headers: deps.effectiveHeaders,
      collapsedHeaders: deps.collapsedHeaders,
      pinned: "left",
      maxHeaderDepth,
      headerHeight: deps.customTheme.headerHeight,
      context: headerContext,
      sectionWidth: widths.leftWidth,
      startColIndex: currentColIndex,
      scrollLeft: scrollLeftFor("left"),
    });
    deps.pinnedLeftHeaderRef.current = leftSection as HTMLDivElement;
    sectionsToKeep.push(leftSection);
    if (leftSection.parentElement !== container) {
      container.insertBefore(leftSection as HTMLElement, container.firstChild);
    }
    currentColIndex = sectionRenderer.getNextColIndex("left");
  }

  if (mainHeaders.length > 0) {
    const mainSection = sectionRenderer.renderHeaderSection({
      headers: deps.effectiveHeaders,
      collapsedHeaders: deps.collapsedHeaders,
      maxHeaderDepth,
      headerHeight: deps.customTheme.headerHeight,
      context: headerContext,
      sectionWidth: widths.mainWidth,
      startColIndex: currentColIndex,
      scrollLeft: scrollLeftFor(),
    });
    deps.mainHeaderRef.current = mainSection as HTMLDivElement;
    sectionsToKeep.push(mainSection);
    if (mainSection.parentElement !== container) {
      const existingRight = deps.pinnedRightHeaderRef.current;
      if (existingRight && existingRight.parentElement === container) {
        container.insertBefore(mainSection as HTMLElement, existingRight);
      } else {
        container.appendChild(mainSection as HTMLElement);
      }
    }
    currentColIndex = sectionRenderer.getNextColIndex("main");
  }

  if (pinnedRightHeaders.length > 0) {
    const rightSection = sectionRenderer.renderHeaderSection({
      headers: deps.effectiveHeaders,
      collapsedHeaders: deps.collapsedHeaders,
      pinned: "right",
      maxHeaderDepth,
      headerHeight: deps.customTheme.headerHeight,
      context: headerContext,
      sectionWidth: widths.rightWidth,
      startColIndex: currentColIndex,
      scrollLeft: scrollLeftFor("right"),
    });
    deps.pinnedRightHeaderRef.current = rightSection as HTMLDivElement;
    sectionsToKeep.push(rightSection);
    if (rightSection.parentElement !== container) {
      container.appendChild(rightSection as HTMLElement);
    }
  }

  Array.from(container.children).forEach((child) => {
    if (!sectionsToKeep.includes(child as HTMLElement)) {
      child.remove();
    }
  });
};
