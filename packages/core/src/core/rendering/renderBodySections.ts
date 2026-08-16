import { CellRenderContext } from "../../utils/bodyCellRenderer";
import {
  createStickyParentsContainer,
  cleanupStickyParentsContainer,
} from "../../utils/stickyParentsRenderer";
import { canDisplaySection } from "../../utils/generalUtils";
import { isColumnEditorStripVisible } from "../../consts/general-consts";
import type TableRow from "../../types/TableRow";
import { rowIdToString } from "../../utils/rowUtils";
import { SectionRenderer } from "./SectionRenderer";
import type { TableRendererDeps } from "./TableRendererDeps";
import type { SectionWidths } from "./cellRenderContexts";

export const renderBodySections = (args: {
  container: HTMLElement;
  processedResult: any;
  deps: TableRendererDeps;
  bodyContext: CellRenderContext;
  widths: SectionWidths;
  calculatedHeaderHeight: number;
  sectionRenderer: SectionRenderer;
  stickyParentsContainer: HTMLElement | null;
}): HTMLElement | null => {
  const {
    container,
    processedResult,
    deps,
    bodyContext,
    widths,
    calculatedHeaderHeight,
    sectionRenderer,
  } = args;
  let stickyParentsContainer = args.stickyParentsContainer;

  if (!container) return stickyParentsContainer;

  const hasAnyVisibleBodySection =
    canDisplaySection(deps.effectiveHeaders, "left") ||
    canDisplaySection(deps.effectiveHeaders, undefined) ||
    canDisplaySection(deps.effectiveHeaders, "right");
  if (!hasAnyVisibleBodySection) {
    const totalHeight = processedResult?.heightMap?.totalHeight ?? 0;
    container.style.minHeight = `${totalHeight}px`;
  } else {
    container.style.minHeight = "";
  }

  const rowsToRender = processedResult.rowsToRender || processedResult.currentTableRows;
  const shouldShowEmptyState =
    !deps.internalIsLoading && processedResult.currentTableRows.length === 0;

  if (deps.selectionManager && processedResult.currentTableRows) {
    deps.selectionManager.updateConfig(
      {
        tableRows: processedResult.currentTableRows,
        headers: deps.effectiveHeaders,
        collapsedHeaders: deps.collapsedHeaders,
        selectableColumns: deps.config.selectableColumns ?? false,
      },
      { positionOnlyBody: deps.positionOnlyBody },
    );
  }

  if (shouldShowEmptyState) {
    sectionRenderer.releaseBodySections();
    container.innerHTML = "";
    deps.mainBodyRef.current = null;
    deps.pinnedLeftRef.current = null;
    deps.pinnedRightRef.current = null;

    const emptyWrapper = document.createElement("div");
    emptyWrapper.className = "st-empty-state-wrapper";

    if (typeof deps.config.tableEmptyStateRenderer === "string") {
      emptyWrapper.textContent = deps.config.tableEmptyStateRenderer;
    } else if (deps.config.tableEmptyStateRenderer instanceof HTMLElement) {
      emptyWrapper.appendChild(deps.config.tableEmptyStateRenderer.cloneNode(true));
    } else {
      emptyWrapper.innerHTML = "<div class='st-empty-state'>No rows to display</div>";
    }

    container.appendChild(emptyWrapper);
    return stickyParentsContainer;
  }

  const pinnedLeftHeaders = deps.effectiveHeaders.filter((h) => h.pinned === "left");
  const mainHeaders = deps.effectiveHeaders.filter((h) => !h.pinned);
  const pinnedRightHeaders = deps.effectiveHeaders.filter((h) => h.pinned === "right");

  let currentColIndex = 0;
  const sectionsToKeep: HTMLElement[] = [];
  const animationCoordinator = deps.positionOnlyBody ? undefined : deps.animationCoordinator;

  const bodySectionParams = {
    headers: deps.effectiveHeaders,
    rows: rowsToRender,
    collapsedHeaders: deps.collapsedHeaders,
    context: bodyContext,
    rowHeight: deps.customTheme.rowHeight,
    heightOffsets: processedResult.paginatedHeightOffsets,
    totalRowCount: processedResult.currentTableRows.length,
    positionOnly: deps.positionOnlyBody,
    fullTableRows: processedResult.currentTableRows,
    renderedStartIndex: processedResult.renderedStartIndex,
    renderedEndIndex: processedResult.renderedEndIndex,
    allFlattenedRows: processedResult.allFlattenedRows,
    pageStartIndex: processedResult.pageStartIndex,
    animationCoordinator,
  };

  if (pinnedLeftHeaders.length > 0) {
    const leftSection = sectionRenderer.renderBodySection({
      ...bodySectionParams,
      pinned: "left",
      sectionWidth: widths.leftWidth,
      startColIndex: currentColIndex,
    });
    deps.pinnedLeftRef.current = leftSection as HTMLDivElement;
    sectionsToKeep.push(leftSection);
    if (leftSection.parentElement !== container) {
      container.insertBefore(leftSection as HTMLElement, container.firstChild);
    }
    currentColIndex = sectionRenderer.getNextColIndex("left");
  }

  if (mainHeaders.length > 0) {
    const mainSection = sectionRenderer.renderBodySection({
      ...bodySectionParams,
      sectionWidth: widths.mainWidth,
      startColIndex: currentColIndex,
    });
    deps.mainBodyRef.current = mainSection as HTMLDivElement;
    sectionsToKeep.push(mainSection);
    if (mainSection.parentElement !== container) {
      const existingRight = deps.pinnedRightRef.current;
      if (existingRight && existingRight.parentElement === container) {
        container.insertBefore(mainSection as HTMLElement, existingRight);
      } else {
        container.appendChild(mainSection as HTMLElement);
      }
    }
    currentColIndex = sectionRenderer.getNextColIndex("main");
  }

  if (pinnedRightHeaders.length > 0) {
    const rightSection = sectionRenderer.renderBodySection({
      ...bodySectionParams,
      pinned: "right",
      sectionWidth: widths.rightWidth,
      startColIndex: currentColIndex,
    });
    deps.pinnedRightRef.current = rightSection as HTMLDivElement;
    sectionsToKeep.push(rightSection);
    if (rightSection.parentElement !== container) {
      container.appendChild(rightSection as HTMLElement);
    }
  }

  if (
    deps.config.enableStickyParents &&
    processedResult.stickyParents &&
    processedResult.stickyParents.length > 0
  ) {
    if (stickyParentsContainer) {
      cleanupStickyParentsContainer(stickyParentsContainer, deps.sectionScrollController ?? null);
      stickyParentsContainer = null;
    }

    const scrollTop = deps.externalScrollActive
      ? (deps.stickyParentsScrollTop ?? 0)
      : (deps.mainBodyRef.current?.scrollTop ?? 0);
    const scrollbarWidth = container.offsetWidth - container.clientWidth;

    const stickySectionColStart = {
      left: 0,
      main: pinnedLeftHeaders.length > 0 ? sectionRenderer.getNextColIndex("left") : 0,
      right:
        mainHeaders.length > 0
          ? sectionRenderer.getNextColIndex("main")
          : pinnedLeftHeaders.length > 0
            ? sectionRenderer.getNextColIndex("left")
            : 0,
    };

    const rowsForBodyCellIndices = rowsToRender.filter(
      (r: TableRow) => !r.nestedTable && !r.stateIndicator,
    );
    const stickyBodyRowIndexByRowKey = new Map<string, number>();
    rowsForBodyCellIndices.forEach((tr: TableRow, rowIndex: number) => {
      const key = tr.stableRowKey ?? rowIdToString(tr.rowId);
      stickyBodyRowIndexByRowKey.set(key, rowIndex);
    });

    stickyParentsContainer = createStickyParentsContainer(
      {
        calculatedHeaderHeight,
        heightMap: processedResult.heightMap,
        partiallyVisibleRows: processedResult.partiallyVisibleRows || [],
        pinnedLeftColumns: pinnedLeftHeaders,
        pinnedLeftWidth: widths.leftWidth,
        pinnedRightColumns: pinnedRightHeaders,
        pinnedRightWidth: widths.rightWidth,
        scrollTop,
        scrollbarWidth,
        stickyParents: processedResult.stickyParents,
        stickySectionColStart,
        stickyBodyRowIndexByRowKey,
        externalScrollActive: deps.externalScrollActive,
      },
      {
        collapsedHeaders: deps.collapsedHeaders,
        customTheme: deps.customTheme,
        enableColumnEditor: isColumnEditorStripVisible(
          deps.config.enableColumnEditor,
          deps.config.columnEditorConfig?.showToggle,
        ),
        headers: deps.effectiveHeaders,
        rowHeight: deps.customTheme.rowHeight,
        heightOffsets: processedResult.paginatedHeightOffsets,
        cellRenderContext: bodyContext,
        sectionScrollController: deps.sectionScrollController ?? null,
      },
    );

    if (stickyParentsContainer) {
      const contentEl = container.parentElement;
      if (contentEl && stickyParentsContainer.parentElement !== contentEl) {
        contentEl.insertBefore(stickyParentsContainer, container);
      } else if (!contentEl) {
        container.appendChild(stickyParentsContainer);
      }
    }
  } else if (stickyParentsContainer) {
    cleanupStickyParentsContainer(stickyParentsContainer, deps.sectionScrollController ?? null);
    stickyParentsContainer = null;
  }

  Array.from(container.children).forEach((child) => {
    if (!sectionsToKeep.includes(child as HTMLElement)) {
      child.remove();
    }
  });

  return stickyParentsContainer;
};
