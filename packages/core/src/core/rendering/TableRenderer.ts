import ColumnDef from "../../types/ColumnDef";
import { SectionRenderer, type HeaderScrollLiveSelection } from "./SectionRenderer";
import { createTableFooter } from "../../utils/footer/createTableFooter";
import { createColumnEditor } from "../../utils/columnEditor/createColumnEditor";
import {
  createHorizontalScrollbar,
  cleanupHorizontalScrollbar,
  syncHorizontalScrollbarLayout,
} from "../../utils/horizontalScrollbarRenderer";
import { cleanupStickyParentsContainer } from "../../utils/stickyParentsRenderer";
import type { CellPosition } from "../../managers/AnimationCoordinator";
import type { SectionScrollController } from "../../managers/SectionScrollController";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils/sectionWidths";
import { deepClone } from "../../utils/generalUtils";
import { isColumnEditorStripVisible } from "../../consts/general-consts";
import type { TableRendererDeps } from "./TableRendererDeps";
import { buildHeaderCellContext, buildBodyCellContext } from "./cellRenderContexts";
import { renderHeaderSections } from "./renderHeaderSections";
import { renderBodySections } from "./renderBodySections";

export type { TableRendererDeps } from "./TableRendererDeps";

export class TableRenderer {
  private sectionRenderer: SectionRenderer;
  private footerInstance: ReturnType<typeof createTableFooter> | null = null;
  // Cache of the inputs that produced the current custom footer DOM, so we can
  // skip wiping + recreating it when nothing relevant changed (e.g. on a
  // scroll-end re-render). Recreating it would leave the container momentarily
  // empty — fatal for async framework adapters (React portals) whose content
  // commits a frame later — collapsing the flex body and resetting scrollTop.
  private lastCustomFooterRenderer: unknown = null;
  private lastCustomFooterKey: string | null = null;
  private columnEditorInstance: ReturnType<typeof createColumnEditor> | null = null;
  private horizontalScrollbarRef: { current: HTMLElement | null } = {
    current: null,
  };
  private scrollbarTimeoutId: number | null = null;
  private stickyParentsContainer: HTMLElement | null = null;
  private sectionScrollController: SectionScrollController | null = null;
  private renderScheduled: boolean = false;
  private pendingRenderCallback: (() => void) | null = null;

  constructor() {
    this.sectionRenderer = new SectionRenderer();
  }

  private scheduleRender(callback: () => void): void {
    if (!this.renderScheduled) {
      this.renderScheduled = true;
      this.pendingRenderCallback = callback;
      queueMicrotask(() => {
        this.renderScheduled = false;
        if (this.pendingRenderCallback) {
          this.pendingRenderCallback();
          this.pendingRenderCallback = null;
        }
      });
    }
  }

  setOnRendererHostDiscard(cb: ((host: HTMLElement) => void) | undefined): void {
    this.sectionRenderer.setOnRendererHostDiscard(cb);
  }

  invalidateCache(type?: "body" | "header" | "context" | "all"): void {
    this.sectionRenderer.invalidateCache(type);
  }

  /**
   * Force the next footer paint to re-invoke `footerRenderer`.
   * Used when `update({ rows })` (or an explicit footer key/renderer change)
   * may have changed footer content even though pagination totals did not.
   */
  invalidateCustomFooterCache(): void {
    this.lastCustomFooterRenderer = null;
    this.lastCustomFooterKey = null;
  }

  /** See {@link SectionRenderer.getCurrentBodyLayouts}. */
  getCurrentBodyLayouts(): Map<HTMLElement, Map<string, CellPosition>> {
    return this.sectionRenderer.getCurrentBodyLayouts();
  }

  /** Re-virtualize main header and body cells for a new horizontal scroll position. */
  virtualizeMainColumnsForScroll(
    scrollLeft: number,
    liveSelection?: HeaderScrollLiveSelection,
  ): void {
    this.sectionRenderer.virtualizeMainHeaderForScroll(scrollLeft, liveSelection);
    this.sectionRenderer.virtualizeMainBodyForScroll(scrollLeft);
  }

  renderHeader(
    container: HTMLElement,
    calculatedHeaderHeight: number,
    maxHeaderDepth: number,
    deps: TableRendererDeps,
  ): void {
    if (!container || deps.config.hideHeader) return;

    const dimensionState = deps.dimensionManager?.getState() ?? {
      containerWidth: 0,
      calculatedHeaderHeight: deps.customTheme.headerHeight,
      maxHeaderDepth: 1,
    };
    const { mainWidth, leftWidth, rightWidth } = recalculateAllSectionWidths({
      headers: deps.effectiveHeaders,
      containerWidth: dimensionState.containerWidth,
      collapsedHeaders: deps.collapsedHeaders,
    });
    const widths = {
      mainWidth,
      leftWidth,
      rightWidth,
      containerWidth: dimensionState.containerWidth,
    };
    const headerContext = buildHeaderCellContext(deps, widths);
    renderHeaderSections({
      container,
      calculatedHeaderHeight,
      maxHeaderDepth,
      deps,
      headerContext,
      widths,
      sectionRenderer: this.sectionRenderer,
    });
  }

  renderBody(container: HTMLElement, processedResult: any, deps: TableRendererDeps): void {
    if (!container) return;

    const dimensionState = deps.dimensionManager?.getState() ?? {
      containerWidth: 0,
      calculatedHeaderHeight: deps.customTheme.headerHeight,
      maxHeaderDepth: 1,
    };
    const { mainWidth, leftWidth, rightWidth } = recalculateAllSectionWidths({
      headers: deps.effectiveHeaders,
      containerWidth: dimensionState.containerWidth,
      collapsedHeaders: deps.collapsedHeaders,
    });
    const widths = {
      mainWidth,
      leftWidth,
      rightWidth,
      containerWidth: dimensionState.containerWidth,
    };
    const bodyContext = buildBodyCellContext(
      deps,
      widths,
      processedResult,
      (cb) => this.scheduleRender(cb),
    );
    this.stickyParentsContainer = renderBodySections({
      container,
      processedResult,
      deps,
      bodyContext,
      widths,
      calculatedHeaderHeight: dimensionState.calculatedHeaderHeight,
      sectionRenderer: this.sectionRenderer,
      stickyParentsContainer: this.stickyParentsContainer,
    });
  }

  renderFooter(
    container: HTMLElement,
    totalRows: number,
    currentPage: number,
    onPageChange: (page: number) => void,
    deps: TableRendererDeps,
  ): void {
    if (!container) return;

    const hasCustomFooter = Boolean(deps.config.footerRenderer);
    const hasPaginationFooter = deps.config.enablePagination && !deps.config.hideFooter;

    if (!hasCustomFooter) {
      this.lastCustomFooterRenderer = null;
      this.lastCustomFooterKey = null;
    }

    if (!hasCustomFooter && !hasPaginationFooter) {
      container.innerHTML = "";
      return;
    }

    const rowsPerPage = deps.config.rowsPerPage ?? 10;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    if (hasCustomFooter) {
      const startRow = (currentPage - 1) * rowsPerPage + 1;
      const endRow = Math.min(currentPage * rowsPerPage, totalRows);

      // Reuse the already-rendered custom footer when none of its inputs
      // changed. Without this, every full render (including scroll-end) wipes
      // the container and re-invokes the renderer; with an async adapter the
      // new content lands a frame later, leaving a 0px footer that collapses
      // the body's scroll overflow and snaps scrollTop back to 0.
      //
      // `footerRenderKey` lets consumers bust this cache for external state
      // (e.g. loading) without replacing the renderer function. Intentional
      // `update({ rows | footerRenderer | footerRenderKey })` also clears the
      // cache via {@link invalidateCustomFooterCache}.
      const customFooterKey = `${currentPage}|${totalRows}|${rowsPerPage}|${totalPages}|${
        deps.config.hideFooter ? 1 : 0
      }|${deps.config.footerRenderKey ?? ""}`;
      if (
        container.childNodes.length > 0 &&
        this.lastCustomFooterRenderer === deps.config.footerRenderer &&
        this.lastCustomFooterKey === customFooterKey
      ) {
        this.footerInstance = null;
        return;
      }
      this.lastCustomFooterRenderer = deps.config.footerRenderer;
      this.lastCustomFooterKey = customFooterKey;

      // When serverSidePagination is enabled, the consumer fetches each page's
      // data in `config.onPageChange`. The built-in footer wires that callback
      // (as `onUserPageChange`); custom footers must do the same so changing the
      // page actually requests new data instead of just updating the highlight.
      const serverSidePagination = deps.config.serverSidePagination ?? false;
      const notifyUserPageChange = (page: number): void | Promise<void> => {
        if (serverSidePagination && deps.config.onPageChange) {
          return deps.config.onPageChange(page);
        }
      };

      const renderedContent = deps.config.footerRenderer!({
        currentPage,
        endRow,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextIcon: deps.resolvedIcons?.next,
        onNextPage: async () => {
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            if (deps.config.onNextPage) await deps.config.onNextPage(currentPage + 1);
            await notifyUserPageChange(currentPage + 1);
          }
        },
        onPageChange: (page: number) => {
          onPageChange(page);
          void notifyUserPageChange(page);
        },
        onPrevPage: () => {
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
            void notifyUserPageChange(currentPage - 1);
          }
        },
        prevIcon: deps.resolvedIcons?.prev,
        rowsPerPage,
        startRow,
        totalPages,
        totalRows,
      });

      container.innerHTML = "";
      if (renderedContent instanceof HTMLElement) {
        container.appendChild(renderedContent);
      } else if (typeof renderedContent === "string") {
        container.innerHTML = renderedContent;
      }
      this.footerInstance = null;
      return;
    }

    if (this.footerInstance) {
      this.footerInstance.update({
        currentPage,
        hideFooter: deps.config.hideFooter ?? false,
        onPageChange,
        onNextPage: deps.config.onNextPage,
        onUserPageChange: deps.config.onPageChange,
        rowsPerPage,
        enablePagination: deps.config.enablePagination ?? false,
        totalPages,
        totalRows,
        prevIcon: deps.resolvedIcons?.prev,
        nextIcon: deps.resolvedIcons?.next,
      });
    } else {
      container.innerHTML = "";
      const footer = createTableFooter({
        currentPage,
        hideFooter: deps.config.hideFooter ?? false,
        onPageChange,
        onNextPage: deps.config.onNextPage,
        onUserPageChange: deps.config.onPageChange,
        rowsPerPage,
        enablePagination: deps.config.enablePagination ?? false,
        totalPages,
        totalRows,
        prevIcon: deps.resolvedIcons?.prev,
        nextIcon: deps.resolvedIcons?.next,
      });
      this.footerInstance = footer;
      container.appendChild(footer.element);
    }
  }

  renderColumnEditor(
    contentWrapper: HTMLElement,
    columnEditorOpen: boolean,
    setColumnEditorOpen: (open: boolean) => void,
    mergedColumnEditorConfig: any,
    deps: TableRendererDeps,
  ): void {
    if (!contentWrapper) return;

    if (!deps.config.enableColumnEditor) {
      if (this.columnEditorInstance) {
        this.columnEditorInstance.destroy();
        this.columnEditorInstance = null;
      }
      return;
    }

    const resetColumns = () => {
      // Restore the last ingested column definitions.
      const pristineHeaders = deps.getPristineDefaultHeaders();
      if (pristineHeaders) {
        deps.setHeaders(deepClone(pristineHeaders));
        deps.onRender();
      }
    };

    // Always the source field catalog — never pivoted live headers.
    const pivotFields = deps.getPristineDefaultHeaders();

    if (this.columnEditorInstance) {
      this.columnEditorInstance.update({
        columnEditorText: mergedColumnEditorConfig.text,
        enableColumnEditor: deps.config.enableColumnEditor,
        enablePivotPanel: deps.config.enablePivotPanel,
        headers: deps.headers,
        pivotFields,
        pivot: deps.getPivot(),
        setPivot: deps.setPivot,
        open: columnEditorOpen,
        searchEnabled: mergedColumnEditorConfig.searchEnabled,
        searchPlaceholder: mergedColumnEditorConfig.searchPlaceholder,
        searchFunction: mergedColumnEditorConfig.searchFunction,
        columnEditorConfig: mergedColumnEditorConfig,
        icons: deps.resolvedIcons,
        essentialAccessors: deps.essentialAccessors,
        setHeaders: (newHeaders: ColumnDef[]) => {
          deps.setHeaders(newHeaders);
          if (this.columnEditorInstance) {
            this.columnEditorInstance.update({
              headers: newHeaders,
            });
          }
          deps.onRender();
        },
        onColumnVisibilityChange: deps.config.onColumnVisibilityChange,
        onColumnOrderChange: deps.config.onColumnOrderChange,
        resetColumns,
        setOpen: setColumnEditorOpen,
      });
    } else {
      const columnEditor = createColumnEditor({
        columnEditorText: mergedColumnEditorConfig.text,
        enableColumnEditor: deps.config.enableColumnEditor ?? false,
        enablePivotPanel: deps.config.enablePivotPanel,
        headers: deps.headers,
        pivotFields,
        pivot: deps.getPivot(),
        setPivot: deps.setPivot,
        open: columnEditorOpen,
        searchEnabled: mergedColumnEditorConfig.searchEnabled,
        searchPlaceholder: mergedColumnEditorConfig.searchPlaceholder,
        searchFunction: mergedColumnEditorConfig.searchFunction,
        columnEditorConfig: mergedColumnEditorConfig,
        icons: deps.resolvedIcons,
        essentialAccessors: deps.essentialAccessors,
        setHeaders: (newHeaders: ColumnDef[]) => {
          deps.setHeaders(newHeaders);
          if (this.columnEditorInstance) {
            this.columnEditorInstance.update({
              headers: newHeaders,
            });
          }
          deps.onRender();
        },
        onColumnVisibilityChange: deps.config.onColumnVisibilityChange,
        onColumnOrderChange: deps.config.onColumnOrderChange,
        resetColumns,
        setOpen: setColumnEditorOpen,
      });
      this.columnEditorInstance = columnEditor;
      contentWrapper.appendChild(columnEditor.element);
    }
  }

  renderHorizontalScrollbar(
    wrapperContainer: HTMLElement,
    mainBodyWidth: number,
    pinnedLeftWidth: number,
    pinnedRightWidth: number,
    pinnedLeftContentWidth: number,
    pinnedRightContentWidth: number,
    tableBodyContainerRef: HTMLDivElement,
    deps: TableRendererDeps,
  ): void {
    if (!wrapperContainer || !tableBodyContainerRef) {
      return;
    }

    // Prefer the body scrollport when present; fall back to the header when the
    // table is empty (empty-state clears body sections, so mainBodyRef is null
    // even though the header remains horizontally scrollable).
    const scrollport =
      deps.mainBodyRef.current ?? deps.mainHeaderRef.current;
    if (!scrollport) {
      return;
    }

    // Viewport = visible main-section width. Prefer the live body clientWidth;
    // when empty, derive it from the body container minus pinned sections.
    // Do NOT use the header's clientWidth alone: header sections are often
    // sized to content width, so clientWidth ≈ scrollWidth even when the
    // table overflows the container.
    const viewportWidth =
      deps.mainBodyRef.current?.clientWidth ??
      Math.max(0, tableBodyContainerRef.clientWidth - pinnedLeftWidth - pinnedRightWidth);

    // Content width is the sum of column widths (`mainBodyWidth`), which stays
    // correct even when virtualization culls off-screen cells. Also accept DOM
    // overflow on the active scrollport when it reports a larger scrollWidth.
    const threshold = 1;
    const contentOverflow = mainBodyWidth - viewportWidth > threshold;
    const domOverflow = scrollport.scrollWidth - scrollport.clientWidth > threshold;
    const isScrollable = contentOverflow || domOverflow;

    // If not scrollable, remove existing scrollbar if present
    if (!isScrollable) {
      if (this.horizontalScrollbarRef.current) {
        cleanupHorizontalScrollbar(
          this.horizontalScrollbarRef.current,
          deps.sectionScrollController,
        );
        this.horizontalScrollbarRef.current = null;
      }
      if (this.scrollbarTimeoutId !== null) {
        clearTimeout(this.scrollbarTimeoutId);
        this.scrollbarTimeoutId = null;
      }
      return;
    }

    if (
      this.horizontalScrollbarRef.current &&
      wrapperContainer.contains(this.horizontalScrollbarRef.current)
    ) {
      const sb = this.horizontalScrollbarRef.current;
      syncHorizontalScrollbarLayout(sb, {
        mainBodyRef: scrollport,
        mainBodyWidth,
        pinnedLeftWidth,
        pinnedRightWidth,
        pinnedLeftContentWidth,
        pinnedRightContentWidth,
        tableBodyContainerRef,
        enableColumnEditor: isColumnEditorStripVisible(
          deps.config.enableColumnEditor,
          deps.config.columnEditorConfig?.showToggle,
        ),
        sectionScrollController: deps.sectionScrollController ?? undefined,
      });
      return;
    }

    // Cancel any pending scrollbar creation
    if (this.scrollbarTimeoutId !== null) {
      clearTimeout(this.scrollbarTimeoutId);
      this.scrollbarTimeoutId = null;
    }

    // Create scrollbar only if it doesn't exist
    this.scrollbarTimeoutId = window.setTimeout(() => {
      if (!tableBodyContainerRef || !wrapperContainer) {
        return;
      }
      const liveScrollport =
        deps.mainBodyRef.current ?? deps.mainHeaderRef.current;
      if (!liveScrollport) {
        return;
      }

      // Double-check it wasn't created by another render
      if (
        this.horizontalScrollbarRef.current &&
        wrapperContainer.contains(this.horizontalScrollbarRef.current)
      ) {
        const existing = this.horizontalScrollbarRef.current;
        syncHorizontalScrollbarLayout(existing, {
          mainBodyRef: liveScrollport,
          mainBodyWidth,
          pinnedLeftWidth,
          pinnedRightWidth,
          pinnedLeftContentWidth,
          pinnedRightContentWidth,
          tableBodyContainerRef,
          enableColumnEditor: isColumnEditorStripVisible(
            deps.config.enableColumnEditor,
            deps.config.columnEditorConfig?.showToggle,
          ),
          sectionScrollController: deps.sectionScrollController ?? undefined,
        });
        this.scrollbarTimeoutId = null;
        return;
      }

      this.sectionScrollController = deps.sectionScrollController ?? null;
      const scrollbar = createHorizontalScrollbar({
        mainBodyRef: liveScrollport,
        mainBodyWidth,
        pinnedLeftWidth,
        pinnedRightWidth,
        pinnedLeftContentWidth,
        pinnedRightContentWidth,
        tableBodyContainerRef,
        enableColumnEditor: isColumnEditorStripVisible(
          deps.config.enableColumnEditor,
          deps.config.columnEditorConfig?.showToggle,
        ),
        sectionScrollController: this.sectionScrollController,
        // Force-create when content width already proved overflow (empty-state
        // header scrollports can report scrollWidth === clientWidth).
        forceScrollable: true,
      });

      if (scrollbar) {
        const contentWrapper = wrapperContainer.querySelector(".st-content-wrapper");
        if (contentWrapper && contentWrapper.nextSibling) {
          wrapperContainer.insertBefore(scrollbar, contentWrapper.nextSibling);
        } else {
          wrapperContainer.appendChild(scrollbar);
        }
        this.horizontalScrollbarRef.current = scrollbar;
      }

      this.scrollbarTimeoutId = null;
    }, 1);
  }

  cleanup(): void {
    this.sectionRenderer.cleanup();
    this.footerInstance?.destroy();
    this.columnEditorInstance?.destroy();

    // Cancel any pending scrollbar creation
    if (this.scrollbarTimeoutId !== null) {
      clearTimeout(this.scrollbarTimeoutId);
      this.scrollbarTimeoutId = null;
    }

    if (this.horizontalScrollbarRef.current) {
      cleanupHorizontalScrollbar(this.horizontalScrollbarRef.current, this.sectionScrollController);
      this.horizontalScrollbarRef.current = null;
    }

    if (this.stickyParentsContainer) {
      cleanupStickyParentsContainer(this.stickyParentsContainer, this.sectionScrollController);
      this.stickyParentsContainer = null;
    }
    this.sectionScrollController = null;
  }
}
