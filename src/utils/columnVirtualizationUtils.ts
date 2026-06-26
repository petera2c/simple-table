import HeaderObject, { Accessor } from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { flattenColumnsForGrid } from "./columnUtils";

/**
 * Column virtualization for the horizontally-scrollable (main) section.
 *
 * This mirrors the row virtualization approach (cumulative position map + binary
 * search + asymmetric overscan) but for columns. The algorithm is ported from the
 * `main` branch's `columnVirtualizationUtils.ts`; the integration differs: instead of
 * recomputing CSS grid offsets, v2 keeps the full `grid-template-columns` track list
 * and places each rendered cell into its real track via `grid-column`, so the leaf
 * order here must match the grid produced by `createGridTemplateColumns`. That is
 * guaranteed by deriving the leaf list from the shared `flattenColumnsForGrid`.
 */

/**
 * Precomputed cumulative width data for O(1) column position lookups and
 * O(log n) viewport calculations (analogous to CumulativeHeightMap for rows).
 */
export interface CumulativeWidthMap {
  /** Left pixel position of each leaf column (index i -> left of column i) */
  columnLeftPositions: number[];
  /** Total nominal width of all leaf columns combined */
  totalWidth: number;
  /** Ordered leaf headers, 1:1 with the section's grid tracks */
  leafHeaders: HeaderObject[];
}

/**
 * Resolve a header's column width to pixels for position math.
 *
 * Only fixed widths (number or "Npx") are exact. fr/%/minmax/auto layouts can't be
 * resolved without measuring the DOM, so we fall back to the column's numeric
 * minWidth or a sensible default. This only affects which columns are *selected* for
 * the window (mitigated by overscan); placement stays correct because cells are
 * positioned by their real grid track via `grid-column`.
 */
export const getColumnWidthInPixels = (header: HeaderObject): number => {
  const { width, minWidth } = header;

  if (typeof width === "number") {
    return width;
  }

  if (typeof width === "string") {
    const trimmed = width.trim();
    if (trimmed.endsWith("px")) {
      const parsed = parseFloat(trimmed);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }

  if (typeof minWidth === "number") {
    return minWidth;
  }
  if (typeof minWidth === "string" && minWidth.trim().endsWith("px")) {
    const parsed = parseFloat(minWidth);
    if (!Number.isNaN(parsed)) return parsed;
  }

  return 150;
};

/**
 * Build a cumulative width map for a section's headers. The leaf order matches the
 * grid tracks created by `createGridTemplateColumns` (both use `flattenColumnsForGrid`).
 */
export const buildCumulativeWidthMap = ({
  headers,
  collapsedHeaders,
}: {
  headers: HeaderObject[];
  collapsedHeaders?: Set<Accessor>;
}): CumulativeWidthMap => {
  const leafHeaders = flattenColumnsForGrid({ headers, collapsedHeaders });

  const columnLeftPositions: number[] = new Array(leafHeaders.length);
  let cumulativeWidth = 0;

  for (let i = 0; i < leafHeaders.length; i++) {
    columnLeftPositions[i] = cumulativeWidth;
    cumulativeWidth += getColumnWidthInPixels(leafHeaders[i]);
  }

  return {
    columnLeftPositions,
    totalWidth: cumulativeWidth,
    leafHeaders,
  };
};

/**
 * Find the leaf column index at a given horizontal scroll position using binary
 * search. Returns the index of the column that contains (or is closest to) the
 * position. Analogous to `findRowAtScrollPosition` for rows.
 */
export const findColumnAtScrollPosition = (
  scrollLeft: number,
  widthMap: CumulativeWidthMap,
): number => {
  const { columnLeftPositions } = widthMap;

  if (columnLeftPositions.length === 0) return 0;
  if (scrollLeft <= 0) return 0;
  if (scrollLeft >= widthMap.totalWidth) return columnLeftPositions.length - 1;

  let left = 0;
  let right = columnLeftPositions.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    if (columnLeftPositions[mid] <= scrollLeft) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }

  return left;
};

/**
 * Calculate the visible leaf columns for the viewport, with an overscan buffer.
 * Returns the [startIndex, endIndex) range into the section's leaf array plus the
 * leaf header objects in that range. Analogous to `getViewportCalculations` for rows.
 */
export const getVisibleColumns = ({
  scrollLeft,
  viewportWidth,
  bufferColumnCount,
  scrollDirection = "none",
  widthMap,
}: {
  scrollLeft: number;
  viewportWidth: number;
  bufferColumnCount: number;
  scrollDirection?: "left" | "right" | "none";
  widthMap: CumulativeWidthMap;
}): {
  startIndex: number;
  endIndex: number;
  columns: HeaderObject[];
} => {
  const { leafHeaders } = widthMap;

  if (leafHeaders.length === 0) {
    return { startIndex: 0, endIndex: 0, columns: [] };
  }

  // Overscan in pixels, based on average column width (mirrors row virtualization).
  const averageColumnWidth =
    leafHeaders.length > 0 ? widthMap.totalWidth / leafHeaders.length : 150;
  const baseOverscanPixels = bufferColumnCount * averageColumnWidth;

  let leftOverscanPixels = baseOverscanPixels;
  let rightOverscanPixels = baseOverscanPixels;

  // Asymmetric overscan based on scroll direction (matches row pattern).
  if (scrollDirection === "right") {
    leftOverscanPixels = Math.max(averageColumnWidth, baseOverscanPixels * 0.1);
    rightOverscanPixels = baseOverscanPixels * 0.9;
  } else if (scrollDirection === "left") {
    leftOverscanPixels = baseOverscanPixels * 0.9;
    rightOverscanPixels = Math.max(
      averageColumnWidth,
      baseOverscanPixels * 0.1,
    );
  }

  const startOffset = Math.max(0, scrollLeft - leftOverscanPixels);
  const endOffset = scrollLeft + viewportWidth + rightOverscanPixels;

  const startIndex = findColumnAtScrollPosition(startOffset, widthMap);
  let endIndex = findColumnAtScrollPosition(endOffset, widthMap) + 1; // +1 to include the column
  endIndex = Math.min(leafHeaders.length, endIndex);

  return {
    startIndex,
    endIndex,
    columns: leafHeaders.slice(startIndex, endIndex),
  };
};

/**
 * Build the set of leaf accessors that should render for the current horizontal
 * viewport, plus a map from accessor to its grid track index (0-based) so cells can
 * be placed with `grid-column: <index + 1>`. Pinned sections never virtualize, so
 * callers pass `null` to disable windowing.
 */
export interface ColumnWindow {
  /** Leaf accessors currently within the viewport (+overscan) */
  visibleAccessors: Set<Accessor>;
  /** Leaf accessor -> 0-based grid track index within the section */
  trackIndexByAccessor: Map<Accessor, number>;
}

export const buildColumnWindow = ({
  headers,
  collapsedHeaders,
  scrollLeft,
  viewportWidth,
  bufferColumnCount,
  scrollDirection,
  pinned,
}: {
  headers: HeaderObject[];
  collapsedHeaders?: Set<Accessor>;
  scrollLeft: number;
  viewportWidth: number;
  bufferColumnCount: number;
  scrollDirection?: "left" | "right" | "none";
  pinned?: Pinned;
}): ColumnWindow | null => {
  // Pinned sections are always small and fully visible; never virtualize them.
  if (pinned) return null;

  const widthMap = buildCumulativeWidthMap({ headers, collapsedHeaders });

  const trackIndexByAccessor = new Map<Accessor, number>();
  widthMap.leafHeaders.forEach((header, index) => {
    trackIndexByAccessor.set(header.accessor, index);
  });

  // Without a measured viewport yet, render everything (avoids a blank first paint).
  if (viewportWidth <= 0) {
    return {
      visibleAccessors: new Set(widthMap.leafHeaders.map((h) => h.accessor)),
      trackIndexByAccessor,
    };
  }

  const { columns } = getVisibleColumns({
    scrollLeft,
    viewportWidth,
    bufferColumnCount,
    scrollDirection,
    widthMap,
  });

  return {
    visibleAccessors: new Set(columns.map((h) => h.accessor)),
    trackIndexByAccessor,
  };
};
