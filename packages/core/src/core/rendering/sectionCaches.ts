import ColumnDef, { Accessor } from "../../types/ColumnDef";
import TableRow from "../../types/TableRow";
import { AbsoluteCell, HeaderRenderContext } from "../../utils/headerCellRenderer";
import { AbsoluteBodyCell, CellRenderContext } from "../../utils/bodyCellRenderer";
import {
  calculateAbsoluteBodyCells,
  calculateAbsoluteHeaderCells,
  getLeafHeaders,
} from "./sectionLayout";

/** Stable ids for callback refs so context cache invalidates when identity changes. */
const callbackIdentityIds = new WeakMap<object, number>();
let nextCallbackIdentityId = 1;

const callbackIdentityKey = (fn: unknown): string => {
  if (typeof fn !== "function") return "none";
  let id = callbackIdentityIds.get(fn);
  if (id === undefined) {
    id = nextCallbackIdentityId++;
    callbackIdentityIds.set(fn, id);
  }
  return String(id);
};

interface BodyCellsCacheEntry {
  cells: AbsoluteBodyCell[];
  deps: {
    headersHash: string;
    /** Order-independent leaf signature (accessor+width+pin+hide). */
    headersStructureHash?: string;
    rowsRef: TableRow[];
    collapsedHeadersSize: number;
    rowHeight: number;
    heightOffsetsHash: string;
    /** Padded row index band over fullTableRows; reduces geometry rebuilds on small scrolls. */
    bandStart?: number;
    bandEnd?: number;
    fullTableRowsRef?: TableRow[];
  };
}

const BODY_CELL_BAND_PADDING = 28;

interface HeaderCellsCacheEntry {
  cells: AbsoluteCell[];
  deps: {
    headersHash: string;
    collapsedHeadersSize: number;
    maxDepth: number;
    headerHeight: number;
  };
}

interface ContextCacheEntry {
  context: CellRenderContext | HeaderRenderContext;
  deps: {
    contextHash: string;
  };
}

/**
 * Caches absolute header/body cell geometry and hashed render contexts per section.
 */
export class SectionCellCaches {
  private bodyCellsCache: Map<string, BodyCellsCacheEntry> = new Map();
  private headerCellsCache: Map<string, HeaderCellsCacheEntry> = new Map();
  private contextCache: Map<string, ContextCacheEntry> = new Map();

  private createHeadersHash(headers: ColumnDef[]): string {
    const hashHeader = (h: ColumnDef): string => {
      let hash = `${h.accessor}:${h.width}:${h.pinned || ""}:${h.hide || ""}:${h.excludeFromRender || ""}`;
      if (h.children && h.children.length > 0) {
        hash += `:children[${h.children.map(hashHeader).join(",")}]`;
      }
      return hash;
    };
    return headers.map(hashHeader).join("|");
  }

  /** Order-independent leaf signature so sibling reorders can remap `left` without a full rebuild. */
  private createHeadersStructureHash(
    headers: ColumnDef[],
    collapsedHeaders: Set<Accessor> = new Set(),
  ): string {
    const leaves = getLeafHeaders(headers, collapsedHeaders);
    return leaves
      .map(
        (h) =>
          `${h.accessor}:${h.width}:${h.pinned || ""}:${h.hide || ""}:${h.excludeFromRender || ""}`,
      )
      .sort()
      .join("|");
  }

  private createHeightOffsetsHash(
    heightOffsets?: Array<[number, number]>,
  ): string {
    if (!heightOffsets || heightOffsets.length === 0) return "";
    return heightOffsets.map(([pos, height]) => `${pos}:${height}`).join("|");
  }

  private createContextHash(context: any): string {
    const keys = [
      "columnBorders",
      "enableRowSelection",
      "selectRowOnClick",
      "rowSelectionMode",
      "activeRowId",
      "cellUpdateFlash",
      "oddColumnBackground",
      "hoverRowBackground",
      "oddEvenRowBackground",
      "rowHeight",
      "containerWidth",
      // Loading skeleton state. Without this, `update({ isLoading })` alone
      // reuses a cached body context with the previous `isLoading` value, so
      // cells (especially expandable ones that only rebuild on skeleton
      // mismatch) never swap between skeletons and real content.
      "isLoading",
      // Column virtualization viewport + content width. `containerWidth` alone is
      // not enough: pinning / pinned-column resize / auto-expand can change
      // leftWidth+rightWidth (and thus mainSectionViewportWidth) while the
      // outer container width stays the same. Reusing a stale viewport here
      // makes getVisibleBodyCells cull every column for rows that scroll back
      // into view — blank rows that only recover after a later resize.
      "mainSectionViewportWidth",
      "mainSectionContainerWidth",
      // Toggling enableVirtualization must invalidate cached body/header contexts
      // so column culling turns on/off without waiting for an unrelated resize.
      "enableVirtualization",
    ];
    let hash = keys.map((k) => `${k}:${context[k]}`).join("|");

    // Callback identity (not toString) so a new `getRowClass` closure — e.g.
    // React useCallback deps changing for a jump/highlight target — invalidates
    // the cached body context and refreshes cell classes.
    hash += `|getRowClass:${callbackIdentityKey(context.getRowClass)}`;

    // Include heightOffsets so contexts captured for body sections invalidate
    // when nested tables expand/collapse above an existing nested row. Without
    // this, the cached context's stale heightOffsets is reused and rows below
    // expanding/collapsing nested tables compute the wrong absolute top — the
    // already-expanded nested table animates to a position that includes a
    // phantom contribution from the previous layout, producing a visible gap
    // during the loading phase before the new nested table has resolved.
    const offsets = context.heightOffsets;
    if (Array.isArray(offsets) && offsets.length > 0) {
      let offsetsSig = "";
      for (let i = 0; i < offsets.length; i++) {
        const entry = offsets[i];
        offsetsSig += `${entry[0]}:${entry[1]};`;
      }
      hash += `|offsets:${offsetsSig}`;
    } else {
      hash += `|offsets:none`;
    }

    // Include sort state in hash for header context
    if (context.sort) {
      hash += `|sort:${context.sort.key.accessor}-${context.sort.direction}`;
    } else {
      hash += `|sort:none`;
    }

    // Include filter state in hash for header context
    if (context.filters && Object.keys(context.filters).length > 0) {
      hash += `|filters:${JSON.stringify(context.filters)}`;
    } else {
      hash += `|filters:none`;
    }

    // Include expansion state in hash for body context
    if (context.expandedRows) {
      hash += `|expandedRows:${context.expandedRows.size}`;
    }
    if (context.collapsedRows) {
      hash += `|collapsedRows:${context.collapsedRows.size}`;
    }
    if (context.expandedDepths) {
      hash += `|expandedDepths:${Array.isArray(context.expandedDepths) ? context.expandedDepths.length : context.expandedDepths.size}`;
    }
    // Include column collapse state so header/body re-render with correct collapse icons and visibility
    if (context.collapsedHeaders != null) {
      const size = context.collapsedHeaders.size;
      const serialized =
        size === 0
          ? ""
          : Array.from(context.collapsedHeaders as Set<unknown>)
              .sort()
              .join(",");
      hash += `|collapsedHeaders:${size}:${serialized}`;
    }
    // Include row selection so body re-renders with updated isRowSelected when selection changes
    if (context.selectedRowCount !== undefined) {
      hash += `|selectedRowCount:${context.selectedRowCount}`;
    }
    // Include column selection so header/body re-render with st-header-selected and st-cell-column-selected
    if (context.selectedColumns && context.selectedColumns.size !== undefined) {
      hash += `|selectedColumns:${Array.from(
        context.selectedColumns as Set<number>,
      )
        .sort((a, b) => a - b)
        .join(",")}`;
    }
    if (
      context.columnsWithSelectedCells &&
      context.columnsWithSelectedCells.size !== undefined
    ) {
      hash += `|columnsWithSelectedCells:${Array.from(
        context.columnsWithSelectedCells as Set<number>,
      )
        .sort((a, b) => a - b)
        .join(",")}`;
    }
    if (
      context.rowsWithSelectedCells &&
      context.rowsWithSelectedCells.size !== undefined
    ) {
      hash += `|rowsWithSelectedCells:${Array.from(
        context.rowsWithSelectedCells as Set<string>,
      )
        .sort()
        .join(",")}`;
    }

    if (context.pinned) {
      hash += `|pinned:${context.pinned}`;
    }
    if (context.pinnedSectionWidthPx !== undefined) {
      hash += `|pinnedSectionWidthPx:${context.pinnedSectionWidthPx}`;
    }

    return hash;
  }

  getCachedBodyCells(
    sectionKey: string,
    headers: ColumnDef[],
    rows: TableRow[],
    collapsedHeaders: Set<Accessor>,
    rowHeight: number,
    heightOffsets?: Array<[number, number]>,
    customTheme?: any,
    startColIndex: number = 0,
    fullTableRows?: TableRow[],
    renderedStartIndex?: number,
    renderedEndIndex?: number,
  ): AbsoluteBodyCell[] {
    const headersHash = this.createHeadersHash(headers);
    const headersStructureHash = this.createHeadersStructureHash(headers, collapsedHeaders);
    const heightOffsetsHash = this.createHeightOffsetsHash(heightOffsets);
    const useRangeCache =
      fullTableRows != null &&
      renderedStartIndex != null &&
      renderedEndIndex != null;

    const cached = this.bodyCellsCache.get(sectionKey);

    const bandCoversViewport = (bandStart: number, bandEnd: number) =>
      bandStart <= renderedStartIndex! && bandEnd >= renderedEndIndex!;

    const rowsMatch = useRangeCache
      ? cached &&
        cached.deps.fullTableRowsRef === fullTableRows &&
        cached.deps.bandStart !== undefined &&
        cached.deps.bandEnd !== undefined &&
        bandCoversViewport(cached.deps.bandStart, cached.deps.bandEnd)
      : cached && cached.deps.rowsRef === rows;

    const cacheHit =
      cached &&
      cached.deps.headersHash === headersHash &&
      cached.deps.collapsedHeadersSize === collapsedHeaders.size &&
      cached.deps.rowHeight === rowHeight &&
      cached.deps.heightOffsetsHash === heightOffsetsHash &&
      rowsMatch;

    if (cacheHit && cached) {
      if (!useRangeCache) {
        return cached.cells;
      }
      const positionToVisualIndex = new Map<number, number>();
      rows.forEach((r, i) => {
        positionToVisualIndex.set(r.position, i);
      });
      const out: AbsoluteBodyCell[] = [];
      for (const c of cached.cells) {
        const ri = positionToVisualIndex.get(c.tableRow.position);
        if (ri === undefined) continue;
        // isOdd is derived from c.tableRow.position upstream and is stable
        // across viewport scrolls — only the visual rowIndex needs remapping.
        if (c.rowIndex !== ri) {
          out.push({ ...c, rowIndex: ri });
        } else {
          out.push(c);
        }
      }
      return out;
    }

    // Same leaves/widths/rows, only sibling order changed — remap left/colIndex.
    if (
      cached &&
      cached.deps.headersStructureHash === headersStructureHash &&
      cached.deps.collapsedHeadersSize === collapsedHeaders.size &&
      cached.deps.rowHeight === rowHeight &&
      cached.deps.heightOffsetsHash === heightOffsetsHash &&
      rowsMatch
    ) {
      const leafHeaders = getLeafHeaders(headers, collapsedHeaders);
      const headerPositions = new Map<string, { left: number; width: number; leafIndex: number }>();
      let currentLeft = 0;
      leafHeaders.forEach((header, leafIndex) => {
        const width = typeof header.width === "number" ? header.width : 150;
        headerPositions.set(String(header.accessor), { left: currentLeft, width, leafIndex });
        currentLeft += width;
      });
      const remapped: AbsoluteBodyCell[] = [];
      for (const c of cached.cells) {
        const pos = headerPositions.get(String(c.header.accessor));
        if (!pos) continue;
        remapped.push({
          ...c,
          header: leafHeaders[pos.leafIndex] ?? c.header,
          left: pos.left,
          width: pos.width,
          colIndex: startColIndex + pos.leafIndex,
        });
      }
      this.bodyCellsCache.set(sectionKey, {
        cells: remapped,
        deps: {
          ...cached.deps,
          headersHash,
          headersStructureHash,
        },
      });
      if (!useRangeCache) {
        return remapped;
      }
      const remapIndex = new Map<number, number>();
      rows.forEach((r, i) => {
        remapIndex.set(r.position, i);
      });
      const remappedOut: AbsoluteBodyCell[] = [];
      for (const c of remapped) {
        const ri = remapIndex.get(c.tableRow.position);
        if (ri === undefined) continue;
        if (c.rowIndex !== ri) {
          remappedOut.push({ ...c, rowIndex: ri });
        } else {
          remappedOut.push(c);
        }
      }
      return remappedOut;
    }

    let bandSlice: TableRow[];
    let bandStart: number | undefined;
    let bandEnd: number | undefined;
    if (useRangeCache) {
      const n = fullTableRows!.length;
      bandStart = Math.max(0, renderedStartIndex! - BODY_CELL_BAND_PADDING);
      bandEnd = Math.min(n, renderedEndIndex! + BODY_CELL_BAND_PADDING);
      bandSlice = fullTableRows!.slice(bandStart, bandEnd);
    } else {
      bandSlice = rows;
    }

    const cells = calculateAbsoluteBodyCells(
      headers,
      bandSlice,
      collapsedHeaders,
      rowHeight,
      heightOffsets,
      customTheme,
      startColIndex,
    );

    this.bodyCellsCache.set(sectionKey, {
      cells,
      deps: {
        headersHash,
        headersStructureHash,
        rowsRef: bandSlice,
        collapsedHeadersSize: collapsedHeaders.size,
        rowHeight,
        heightOffsetsHash,
        ...(useRangeCache && {
          fullTableRowsRef: fullTableRows,
          bandStart,
          bandEnd,
        }),
      },
    });

    if (!useRangeCache) {
      return cells;
    }

    const positionToVisualIndex = new Map<number, number>();
    rows.forEach((r, i) => {
      positionToVisualIndex.set(r.position, i);
    });
    const mapped: AbsoluteBodyCell[] = [];
    for (const c of cells) {
      const ri = positionToVisualIndex.get(c.tableRow.position);
      if (ri === undefined) continue;
      // isOdd is derived from c.tableRow.position upstream and is stable
      // across viewport scrolls — only the visual rowIndex needs remapping.
      if (c.rowIndex !== ri) {
        mapped.push({ ...c, rowIndex: ri });
      } else {
        mapped.push(c);
      }
    }
    return mapped;
  }

  getCachedHeaderCells(
    sectionKey: string,
    headers: ColumnDef[],
    collapsedHeaders: Set<Accessor>,
    maxDepth: number,
    headerHeight: number,
    startColIndex: number = 0,
  ): AbsoluteCell[] {
    const cached = this.headerCellsCache.get(sectionKey);

    const headersHash = this.createHeadersHash(headers);

    if (
      cached &&
      cached.deps.headersHash === headersHash &&
      cached.deps.collapsedHeadersSize === collapsedHeaders.size &&
      cached.deps.maxDepth === maxDepth &&
      cached.deps.headerHeight === headerHeight
    ) {
      return cached.cells;
    }

    const cells = calculateAbsoluteHeaderCells(
      headers,
      collapsedHeaders,
      maxDepth,
      headerHeight,
      startColIndex,
    );

    this.headerCellsCache.set(sectionKey, {
      cells,
      deps: {
        headersHash,
        collapsedHeadersSize: collapsedHeaders.size,
        maxDepth,
        headerHeight,
      },
    });

    return cells;
  }

  getCachedContext<T extends CellRenderContext | HeaderRenderContext>(
    cacheKey: string,
    context: T,
    pinned?: "left" | "right",
    sectionWidth?: number,
  ): T {
    const cached = this.contextCache.get(cacheKey);
    const pinnedSectionWidthPx =
      pinned === "left" || pinned === "right" ? sectionWidth : undefined;
    const newContext = {
      ...context,
      pinned,
      pinnedSectionWidthPx,
    } as T;
    const contextHash = this.createContextHash(newContext);

    if (cached && cached.deps.contextHash === contextHash) {
      return cached.context as T;
    }

    this.contextCache.set(cacheKey, {
      context: newContext,
      deps: { contextHash },
    });

    return newContext;
  }

  clearBody(): void {
    this.bodyCellsCache.clear();
  }

  clearHeader(): void {
    this.headerCellsCache.clear();
  }

  clearContext(): void {
    this.contextCache.clear();
  }

  clearAll(): void {
    this.bodyCellsCache.clear();
    this.headerCellsCache.clear();
    this.contextCache.clear();
  }
}
