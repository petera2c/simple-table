import {
  renderHeaderCells,
  HeaderRenderContext,
  cleanupHeaderCellRendering,
} from "../../utils/headerCellRenderer";
import {
  renderBodyCells,
  CellRenderContext,
  cleanupBodyCellRendering,
} from "../../utils/bodyCellRenderer";
import TableRow from "../../types/TableRow";
import ColumnDef, { Accessor } from "../../types/ColumnDef";
import { DEFAULT_CUSTOM_THEME } from "../../types/CustomTheme";
import type { AnimationCoordinator, CellPosition } from "../../managers/AnimationCoordinator";
import { calculateTotalHeight } from "../../utils/infiniteScrollUtils";
import {
  computeFullSectionLayout,
  buildBodySectionSnapshotConfig,
  type BodySectionSnapshotConfig,
} from "./sectionLayout";
import { SectionCellCaches } from "./sectionCaches";
import {
  renderNestedGridRows,
  renderStateRows,
  releaseExtraRowMaps,
  type NestedGridRowEntry,
  type StateRowEntry,
} from "./sectionExtraRows";

export interface HeaderSectionParams {
  headers: ColumnDef[];
  collapsedHeaders: Set<Accessor>;
  pinned?: "left" | "right";
  maxHeaderDepth: number;
  headerHeight: number;
  context: HeaderRenderContext;
  sectionWidth?: number;
  startColIndex?: number;
}

export interface BodySectionParams {
  headers: ColumnDef[];
  rows: TableRow[];
  collapsedHeaders: Set<Accessor>;
  pinned?: "left" | "right";
  context: CellRenderContext;
  sectionWidth?: number;
  rowHeight: number;
  heightOffsets?: Array<[number, number]>;
  totalRowCount?: number;
  startColIndex?: number;
  /** When true, only update cell positions for existing cells (scroll performance). */
  positionOnly?: boolean;
  /** Full table rows ref + range for range-based body cell cache (avoids cache miss on every scroll). */
  fullTableRows?: TableRow[];
  renderedStartIndex?: number;
  renderedEndIndex?: number;
  /** Full pre-pagination flattened rows (used by animation snapshot to include
   * off-page rows so cross-page sort can FLIP cells in/out from off-screen). */
  allFlattenedRows?: TableRow[];
  /** Global flattened-list index where the current page starts. Used to offset
   * absolute positions in {@link allFlattenedRows} so on-page rows align with
   * the page-relative DOM positions while off-page rows fall above/below. */
  pageStartIndex?: number;
  /** When provided, body cell renderer hands outgoing cells to the coordinator
   * for FLIP-style out-animation instead of removing them immediately. */
  animationCoordinator?: AnimationCoordinator;
}

export class SectionRenderer {
  private headerSections: Map<string, HTMLElement> = new Map();
  private bodySections: Map<string, HTMLElement> = new Map();

  /**
   * Callback fired before a body cell host element is permanently removed in
   * the {@link invalidateCache} "all" path (which wipes every rendered cell).
   * Threaded down from the table config so framework adapters can tear down
   * renderer subtrees (React portals, etc.) before the nodes are discarded.
   */
  private onRendererHostDiscard?: (host: HTMLElement) => void;

  private caches = new SectionCellCaches();
  private bodySectionSnapshots: Map<string, BodySectionSnapshotConfig> = new Map();

  // Track the next colIndex for each section after rendering
  private nextColIndexMap: Map<string, number> = new Map();

  // State row elements per section.
  // Keyed by expandStateKey(tableRow) (state rows carry a sort-stable
  // stableRowKey) rather than numeric `position` or path-based rowId.
  private stateRowsMap: Map<string, Map<string, StateRowEntry>> = new Map();

  // Nested grid row elements per section.
  // Keyed by expandStateKey(tableRow) (nested/state rows carry a sort-stable
  // stableRowKey) rather than path-based rowId, which includes indices that change
  // after sort — mismatches tore down the nested SimpleTable and killed slide animations.
  private nestedGridRowsMap: Map<string, Map<string, NestedGridRowEntry>> = new Map();

  renderHeaderSection(params: HeaderSectionParams): HTMLElement {
    const {
      headers,
      collapsedHeaders,
      pinned,
      maxHeaderDepth,
      headerHeight,
      context,
      sectionWidth,
      startColIndex = 0,
    } = params;

    const sectionKey = pinned || "main";
    let section = this.headerSections.get(sectionKey);

    if (!section) {
      section = document.createElement("div");
      section.className =
        pinned === "left"
          ? "st-header-pinned-left"
          : pinned === "right"
            ? "st-header-pinned-right"
            : "st-header-main";
      // Section is a visual-only sub-container; the ARIA rowgroup lives on the
      // header/body container (its parent). Leaving the section role-less keeps
      // it transparent so the row elements it holds resolve to that rowgroup.
      this.headerSections.set(sectionKey, section);
    }

    const filteredHeaders = headers.filter((h) => {
      if (pinned === "left") return h.pinned === "left";
      if (pinned === "right") return h.pinned === "right";
      return !h.pinned;
    });

    if (filteredHeaders.length === 0) {
      section.style.display = "none";
      return section;
    }

    section.style.display = "";

    section.style.cssText = `
      position: relative;
      ${sectionWidth !== undefined ? `width: ${sectionWidth}px;` : ""}
      height: ${maxHeaderDepth * headerHeight}px;
    `;

    const absoluteCells = this.caches.getCachedHeaderCells(
      sectionKey,
      filteredHeaders,
      collapsedHeaders,
      maxHeaderDepth,
      headerHeight,
      startColIndex,
    );

    // Calculate and store the next colIndex for this section
    const maxColIndex =
      absoluteCells.length > 0
        ? Math.max(...absoluteCells.map((c) => c.colIndex)) + 1
        : startColIndex;
    this.nextColIndexMap.set(sectionKey, maxColIndex);

    const cachedContext = this.caches.getCachedContext(
      `header-${sectionKey}`,
      context,
      pinned,
      sectionWidth,
    );

    // Render with current scrollLeft to preserve scroll position during re-renders
    const currentScrollLeft = section.scrollLeft;
    renderHeaderCells(section, absoluteCells, cachedContext, currentScrollLeft);
    // Restore header scroll after render so the browser doesn't reset it (which would trigger header→body sync and reset body scroll)
    if (!pinned && currentScrollLeft !== section.scrollLeft) {
      section.scrollLeft = currentScrollLeft;
    }

    // For main section (not pinned), attach render function for scroll updates.
    // cachedContext is from the last full header render; during vertical drag-scroll the header
    // may not re-render while selection changes. Callers should pass live selection sets so
    // calculateHeaderCellClasses does not overwrite st-header-* with stale data (flicker).
    if (!pinned && section) {
      (section as any).__renderHeaderCells = (
        scrollLeft: number,
        liveSelection?: {
          columnsWithSelectedCells: Set<number>;
          selectedColumns: Set<number>;
        },
      ) => {
        if (!section) return;
        const ctx =
          liveSelection !== undefined
            ? {
                ...cachedContext,
                columnsWithSelectedCells: liveSelection.columnsWithSelectedCells,
                selectedColumns: liveSelection.selectedColumns,
              }
            : cachedContext;
        renderHeaderCells(section, absoluteCells, ctx, scrollLeft);
      };
    }

    return section;
  }

  renderBodySection(params: BodySectionParams): HTMLElement {
    const {
      headers,
      rows,
      collapsedHeaders,
      pinned,
      context,
      sectionWidth,
      rowHeight,
      heightOffsets,
      totalRowCount,
      startColIndex = 0,
      positionOnly = false,
      fullTableRows,
      renderedStartIndex,
      renderedEndIndex,
      allFlattenedRows,
      pageStartIndex,
      animationCoordinator,
    } = params;

    const sectionKey = pinned || "main";
    let section = this.bodySections.get(sectionKey);

    if (!section) {
      section = document.createElement("div");
      section.className =
        pinned === "left"
          ? "st-body-pinned-left"
          : pinned === "right"
            ? "st-body-pinned-right"
            : "st-body-main";
      // Section is a visual-only sub-container; the ARIA rowgroup lives on the
      // body container (its parent). Leaving the section role-less keeps it
      // transparent so the row elements it holds resolve to that rowgroup.
      this.bodySections.set(sectionKey, section);
    }

    const filteredHeaders = headers.filter((h) => {
      if (pinned === "left") return h.pinned === "left";
      if (pinned === "right") return h.pinned === "right";
      return !h.pinned;
    });

    if (filteredHeaders.length === 0) {
      section.style.display = "none";
      return section;
    }

    section.style.display = "";

    // Calculate total height properly using calculateTotalHeight with heightOffsets
    const rowCount = totalRowCount !== undefined ? totalRowCount : rows.length;
    const totalHeight = calculateTotalHeight(
      rowCount,
      rowHeight,
      heightOffsets,
      context.customTheme ?? DEFAULT_CUSTOM_THEME,
    );

    section.style.cssText = `
      position: relative;
      ${sectionWidth !== undefined ? `width: ${sectionWidth}px;` : ""}
      ${!pinned ? "flex-grow: 1;" : ""}
      height: ${totalHeight}px;
    `;

    const absoluteCells = this.caches.getCachedBodyCells(
      sectionKey,
      filteredHeaders,
      rows,
      collapsedHeaders,
      rowHeight,
      heightOffsets,
      context.customTheme ?? DEFAULT_CUSTOM_THEME,
      startColIndex,
      fullTableRows,
      renderedStartIndex,
      renderedEndIndex,
    );

    // Cache just enough state to recompute the position of every cell in this
    // section (including off-screen rows) for animation snapshots. The
    // animation coordinator reads these on captureAnimationSnapshot and
    // needs them to FLIP cells that were never in the DOM (rows that slide
    // into view from off-screen) or that won't be in the DOM after the
    // change (rows that slide out of view).
    // Prefer the pre-pagination flattened list so the snapshot covers off-page
    // rows too — paginated tables that re-sort across the whole dataset need
    // those rows present in the snapshot to FLIP cells in/out from off-screen.
    // When pagination is off, allFlattenedRows is identical to fullTableRows
    // and pageStartIndex is 0, so the math collapses to the legacy behavior.
    const snapshotRows = allFlattenedRows ?? fullTableRows ?? rows;
    const snapshotPageStartIndex =
      allFlattenedRows !== undefined ? (pageStartIndex ?? 0) : undefined;
    this.captureSnapshotConfig(
      sectionKey,
      filteredHeaders,
      collapsedHeaders,
      snapshotRows,
      rowHeight,
      heightOffsets,
      context.customTheme ?? DEFAULT_CUSTOM_THEME,
      snapshotPageStartIndex,
    );

    // The post-render full layout maps every cell id (visible OR off-screen)
    // to its destination in the *new* state. The body cell renderer hands
    // this to the animation coordinator so cells exiting the visible band
    // can slide to their off-screen post-change position before being torn
    // down — instead of just disappearing in place.
    const fullCellLayout = animationCoordinator
      ? this.getFullSectionLayout(sectionKey)
      : null;

    const dataRowCount = rows.filter((r) => !r.nestedTable && !r.stateIndicator).length;
    const maxColIndex =
      absoluteCells.length > 0 && dataRowCount > 0
        ? startColIndex + absoluteCells.length / dataRowCount
        : startColIndex;
    this.nextColIndexMap.set(sectionKey, maxColIndex);

    const cachedContext = this.caches.getCachedContext(
      `body-${sectionKey}`,
      context,
      pinned,
      sectionWidth,
    );

    // Render with current scrollLeft to preserve scroll position during re-renders.
    // Pass full rows so separators and nested grid rows account for every row.
    const currentScrollLeft = section.scrollLeft;
    renderBodyCells(
      section,
      absoluteCells,
      cachedContext,
      currentScrollLeft,
      rows,
      positionOnly,
      animationCoordinator,
      fullCellLayout ?? undefined,
    );

    // Render nested grid rows (full-width rows that contain a nested SimpleTable) or spacers in pinned sections
    renderNestedGridRows(
      section,
      sectionKey,
      rows,
      pinned,
      cachedContext,
      animationCoordinator,
      this.nestedGridRowsMap,
      this.stateRowsMap,
    );

    // Render state indicator rows (loading/error/empty) as full-width rows – only in main (non-pinned) section
    if (!pinned) {
      renderStateRows(
        section,
        sectionKey,
        rows,
        cachedContext,
        animationCoordinator,
        this.stateRowsMap,
      );
    }

    // For main section (not pinned), attach render function for scroll updates (used by SectionScrollController.onMainSectionScrollLeft)
    if (!pinned && section) {
      (section as any).__renderBodyCells = (scrollLeft: number) => {
        if (section) {
          renderBodyCells(
            section,
            absoluteCells,
            cachedContext,
            scrollLeft,
            rows,
            true,
          );
        }
      };
    }

    return section!;
  }

  setOnRendererHostDiscard(cb: ((host: HTMLElement) => void) | undefined): void {
    this.onRendererHostDiscard = cb;
  }

  invalidateCache(type?: "body" | "header" | "context" | "all"): void {
    if (!type || type === "all") {
      this.caches.clearAll();
      // Clear rendered cell elements from all body sections
      this.bodySections.forEach((section) => {
        cleanupBodyCellRendering(section, this.onRendererHostDiscard);
      });
      // Clear rendered cell elements from all header sections
      this.headerSections.forEach((section) => {
        cleanupHeaderCellRendering(section, this.onRendererHostDiscard);
      });
    } else if (type === "body") {
      // Only clear the calculated cells cache so we recompute the cell list (e.g. after expand/collapse).
      // Do NOT clear rendered cell elements: renderBodyCells will update existing cells in place
      // (so expand icon can animate) and remove only cells no longer visible.
      this.caches.clearBody();
    } else if (type === "header") {
      // Only clear the calculated cells cache so we recompute layout for new header order/widths.
      // Do NOT clear rendered cell elements: renderHeaderCells reuses cells by accessor and updates
      // position/classes in place. Tearing down cells on every drag swap caused visible flicker
      // because each `dragover` recreated all 11 header cells (debug session 65665a, H6).
      this.caches.clearHeader();
    } else if (type === "context") {
      this.caches.clearContext();
      // Recompute absolute header layout from current effectiveHeaders; otherwise
      // cached AbsoluteCell.header refs drift from live objects (sort/resize bug).
      this.caches.clearHeader();
      // Do NOT clear rendered header cells: renderHeaderCells refreshes icons (sort/filter)
      // in place via per-cell iconState tracking on dataset. See `renderHeaderCells`
      // existing-cell branch in `headerCellRenderer.ts`.
    }
  }

  /**
   * Get the next colIndex after rendering a section
   */
  getNextColIndex(sectionKey: string): number {
    return this.nextColIndexMap.get(sectionKey) ?? 0;
  }

  /**
   * Build a per-section layout map covering every cell in the dataset (every
   * row × every leaf header), not just the cells in the current virtualization
   * band. Used by the animation coordinator: it needs positions for off-screen
   * rows so that:
   *
   *   - Cells that newly enter the visible band (e.g. row sorted from bottom
   *     to top) can FLIP in from their actual pre-change off-screen `top`.
   *   - Cells that leave the visible band (e.g. row sorted from top to
   *     bottom) can be retained and slid to their actual post-change
   *     off-screen `top` before being removed.
   *
   * The body container clips overflow so cells whose interpolated position
   * falls outside the viewport simply aren't painted — the animation looks
   * like a slide in from / out to the viewport edge.
   */
  getCurrentBodyLayouts(): Map<HTMLElement, Map<string, CellPosition>> {
    const out = new Map<HTMLElement, Map<string, CellPosition>>();
    this.bodySectionSnapshots.forEach((config, sectionKey) => {
      const section = this.bodySections.get(sectionKey);
      if (!section) return;
      out.set(section, computeFullSectionLayout(config));
    });
    return out;
  }

  /**
   * Compute every cell position the section currently knows about (every row
   * × every leaf header), including positions for off-screen rows, by using
   * the most recent snapshot config for `sectionKey`. Returns null if no
   * snapshot has been captured for this section yet.
   */
  getFullSectionLayout(sectionKey: string): Map<string, CellPosition> | null {
    const config = this.bodySectionSnapshots.get(sectionKey);
    return config ? computeFullSectionLayout(config) : null;
  }

  /**
   * Refresh the per-section snapshot config so getCurrentBodyLayouts can
   * recompute positions for any row × column combination the section
   * currently knows about.
   */
  private captureSnapshotConfig(
    sectionKey: string,
    headers: ColumnDef[],
    collapsedHeaders: Set<Accessor>,
    rows: TableRow[],
    rowHeight: number,
    heightOffsets?: Array<[number, number]>,
    customTheme?: any,
    pageStartIndex?: number,
  ): void {
    this.bodySectionSnapshots.set(
      sectionKey,
      buildBodySectionSnapshotConfig(
        headers,
        collapsedHeaders,
        rows,
        rowHeight,
        heightOffsets,
        customTheme,
        pageStartIndex,
      ),
    );
  }

  /**
   * Tear down all body sections and forget them so a subsequent
   * `renderBodySection` creates fresh nodes. Used when the empty-state path
   * takes over the body container: clearing `innerHTML` alone leaves
   * `renderedCells` pointing at detached nodes, so rows never remount when
   * data returns (e.g. typing `-E` mid-filter briefly matches every row).
   */
  releaseBodySections(): void {
    this.bodySections.forEach((section) => {
      cleanupBodyCellRendering(section, this.onRendererHostDiscard);
      section.remove();
    });
    this.bodySections.clear();
    this.caches.clearBody();
    this.bodySectionSnapshots.clear();
    releaseExtraRowMaps(this.nestedGridRowsMap, this.stateRowsMap);
  }

  cleanup(): void {
    this.releaseBodySections();
    this.headerSections.clear();
    this.caches.clearHeader();
    this.caches.clearContext();
    this.nextColIndexMap.clear();
  }
}
