import {
  TABLE_HEADER_CELL_WIDTH_DEFAULT,
  CHART_COLUMN_TYPES,
  OPTIMAL_CHART_COLUMN_WIDTH,
  AUTO_SIZE_HEAD_SAMPLE_SIZE,
  AUTO_SIZE_STRIDED_SAMPLE_SIZE,
  AUTO_SIZE_MAX_WIDTH,
  AUTO_SIZE_OUTLIER_PERCENTILE,
  AUTO_SIZE_OUTLIER_THRESHOLD,
  AUTO_SIZE_MIN_SAMPLE_FOR_CLIP,
  AUTO_SIZE_WIDTH_BUFFER,
  AUTO_SIZE_HEADER_ICON_PADDING,
} from "../consts/general-consts";
import { MIN_COLUMN_WIDTH } from "../consts/column-constraints";
import HeaderObject, { Accessor, DEFAULT_SHOW_WHEN } from "../types/HeaderObject";
import { getCellId } from "./cellUtils";
import { getNestedValue } from "./rowUtils";
import { hasCollapsibleChildren } from "./collapseUtils";

/**
 * Build the set of row indices to sample for auto-size measurement.
 * Hybrid strategy: the first `headSize` rows (always include the top / initial
 * viewport) plus `stridedSize` rows spread at an even stride across the rest of
 * the dataset, so wide values deeper in the data are caught without scanning
 * every row. Strided (not random) keeps the result deterministic across renders.
 */
export const buildHybridSampleIndices = (
  rowCount: number,
  headSize: number,
  stridedSize: number,
): number[] => {
  if (rowCount <= 0) return [];
  const head = Math.max(0, Math.floor(headSize));
  const strided = Math.max(0, Math.floor(stridedSize));

  if (rowCount <= head + strided) {
    return Array.from({ length: rowCount }, (_, i) => i);
  }

  const indices = new Set<number>();
  for (let i = 0; i < Math.min(head, rowCount); i++) {
    indices.add(i);
  }

  const remainingStart = head;
  const remainingCount = rowCount - remainingStart;
  if (strided > 0 && remainingCount > 0) {
    const stride = Math.max(1, Math.floor(remainingCount / strided));
    for (let k = 0; k < strided; k++) {
      const idx = remainingStart + k * stride;
      if (idx >= rowCount) break;
      indices.add(idx);
    }
    // Always include the very last row so the deepest values are considered.
    indices.add(rowCount - 1);
  }

  return Array.from(indices).sort((a, b) => a - b);
};

/** Linear-interpolated percentile (0-100) of a numeric array. */
export const percentileOf = (values: number[], percentile: number): number => {
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  const sorted = [...values].sort((a, b) => a - b);
  const p = Math.min(100, Math.max(0, percentile));
  const rank = (p / 100) * (sorted.length - 1);
  const low = Math.floor(rank);
  const high = Math.ceil(rank);
  if (low === high) return sorted[low];
  const frac = rank - low;
  return sorted[low] + (sorted[high] - sorted[low]) * frac;
};

/**
 * Choose a representative "content width" from sampled cell widths, clipping
 * outliers only when they clearly stand apart from the bulk of the data.
 *
 * - Uses the true max when the column is uniform (max close to the percentile),
 *   so nothing legitimate gets truncated.
 * - Falls back to the percentile width only when `max > p * (1 + threshold)` and
 *   there are enough samples to trust the percentile, so a single rogue 2000px
 *   row can't define the whole column.
 */
export const selectContentWidthWithOutlierClip = (
  widths: number[],
  options?: {
    percentile?: number;
    threshold?: number;
    minSampleForClip?: number;
  },
): number => {
  if (widths.length === 0) return 0;
  const max = Math.max(...widths);
  const percentile = options?.percentile ?? AUTO_SIZE_OUTLIER_PERCENTILE;
  const threshold = options?.threshold ?? AUTO_SIZE_OUTLIER_THRESHOLD;
  const minSampleForClip = options?.minSampleForClip ?? AUTO_SIZE_MIN_SAMPLE_FOR_CLIP;

  if (widths.length < minSampleForClip) return max;

  const p = percentileOf(widths, percentile);
  if (p > 0 && max > p * (1 + threshold)) {
    return p;
  }
  return max;
};

/**
 * Find all leaf headers (headers without children) in a header tree
 * Takes collapsed state into account - when a header is collapsed, only returns
 * children that are visible when parent is collapsed (showWhen is 'parentCollapsed' or 'always')
 */
export const findLeafHeaders = (
  header: HeaderObject,
  collapsedHeaders?: Set<Accessor>,
): HeaderObject[] => {
  // Skip headers that are not part of the rendered table. `excludeFromRender`
  // columns (e.g. CSV-export-only) are never laid out by SectionRenderer, so
  // they must not contribute to section/row width either — otherwise the body
  // row container ends up wider than the rendered cells by the sum of their
  // widths, producing an empty horizontal-scroll region.
  if (header.hide || header.excludeFromRender) {
    return [];
  }

  if (!header.children || header.children.length === 0) {
    return [header];
  }

  // If this header is collapsed, only return children that are visible when collapsed
  if (collapsedHeaders && collapsedHeaders.has(header.accessor)) {
    const visibleWhenCollapsed = header.children.filter((child) => {
      const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
      return showWhen === "parentCollapsed" || showWhen === "always";
    });
    // singleRowChildren: the parent is always a leaf (has its own column). When collapsed, also include visible children.
    if (header.singleRowChildren) {
      if (visibleWhenCollapsed.length === 0) {
        return [header];
      }
      return [
        header,
        ...visibleWhenCollapsed.flatMap((child) => findLeafHeaders(child, collapsedHeaders)),
      ];
    }
    if (visibleWhenCollapsed.length === 0) {
      return [header];
    }
    return visibleWhenCollapsed.flatMap((child) =>
      findLeafHeaders(child, collapsedHeaders),
    );
  }

  // If not collapsed, return leaf headers that are visible when parent is expanded
  const visibleWhenExpanded = header.children.filter((child) => {
    const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
    return showWhen === "parentExpanded" || showWhen === "always";
  });
  // singleRowChildren: parent + children are all "leaves" on the same row (e.g. Quarterly Sales + Q1–Q4)
  if (header.singleRowChildren) {
    return [
      header,
      ...visibleWhenExpanded.flatMap((child) =>
        findLeafHeaders(child, collapsedHeaders),
      ),
    ];
  }
  return visibleWhenExpanded.flatMap((child) =>
    findLeafHeaders(child, collapsedHeaders),
  );
};

/** Default pixel width for 1fr when converting before container width is known */
export const DEFAULT_FR_PX = 150;

/** Default total table width used when normalizing fr/% if container width unknown */
export const DEFAULT_TABLE_WIDTH = 800;

type WidthSpec =
  | { type: "px"; value: number }
  | { type: "fr"; value: number }
  | { type: "pct"; value: number }
  | { type: "auto" };

/** True when a header's width requests content-based auto-sizing (`width: "auto"`). */
export const isAutoWidth = (header: HeaderObject): boolean =>
  typeof header.width === "string" && header.width.trim().toLowerCase() === "auto";

function parseWidthSpec(header: HeaderObject): WidthSpec | null {
  if (header.hide) return null;
  if (typeof header.width === "number") return { type: "px", value: header.width };
  if (typeof header.width !== "string") return null;
  const s = header.width.trim();
  // "auto" columns get a provisional pixel width until measured; flag them explicitly
  // (rather than silently falling back to the default) so the engine can resolve them.
  if (s.toLowerCase() === "auto") return { type: "auto" };
  if (s.endsWith("px")) return { type: "px", value: parseFloat(s) || 0 };
  if (s.endsWith("fr")) return { type: "fr", value: parseFloat(s) || 1 };
  if (s.endsWith("%")) return { type: "pct", value: parseFloat(s) || 0 };
  return null;
}

/**
 * Recursively collect leaf headers for width normalization (expanded state).
 * Mirrors `findLeafHeaders` for `singleRowChildren`: the parent is itself a
 * leaf column and must be included in the width map, otherwise `width: "auto"`
 * / fr / % on that parent never resolve to pixels.
 */
function getLeafHeadersForNormalization(headers: HeaderObject[]): HeaderObject[] {
  const leaves: HeaderObject[] = [];
  const visit = (h: HeaderObject): void => {
    if (h.hide) return;
    if (!h.children || h.children.length === 0) {
      leaves.push(h);
      return;
    }
    if (h.singleRowChildren) {
      leaves.push(h);
    }
    h.children.forEach(visit);
  };
  headers.forEach(visit);
  return leaves;
}

/**
 * Build a width map for a section's leaves given a total width.
 * Used so we can normalize main section to container width after left/right are sized.
 */
function buildSectionWidthMap(
  leaves: HeaderObject[],
  total: number,
): Map<string, number> {
  const specs = leaves.map((h) => parseWidthSpec(h));
  const fixedSum = specs.reduce(
    (sum, s) => (s?.type === "px" ? sum + s.value : sum),
    0,
  );
  const pctSum = specs.reduce(
    (sum, s) => (s?.type === "pct" ? sum + s.value : sum),
    0,
  );
  const pctPx = total * (pctSum / 100);
  const frTotal = specs.reduce(
    (sum, s) => (s?.type === "fr" ? sum + s.value : sum),
    0,
  );
  const remainingForFr = Math.max(0, total - fixedSum - pctPx);
  const pxPerFr = frTotal > 0 ? remainingForFr / frTotal : DEFAULT_FR_PX;

  const widthMap = new Map<string, number>();
  leaves.forEach((h, i) => {
    const spec = specs[i];
    if (!spec) {
      widthMap.set(h.accessor as string, TABLE_HEADER_CELL_WIDTH_DEFAULT);
      return;
    }
    if (spec.type === "auto") {
      // Provisional width until the auto-size pass measures real content.
      const minW =
        typeof h.minWidth === "number"
          ? h.minWidth
          : typeof h.minWidth === "string"
            ? parseFloat(String(h.minWidth)) || 0
            : 0;
      widthMap.set(
        h.accessor as string,
        Math.max(TABLE_HEADER_CELL_WIDTH_DEFAULT, minW),
      );
    } else if (spec.type === "px") widthMap.set(h.accessor as string, spec.value);
    else if (spec.type === "fr") {
      const frAssigned = spec.value * pxPerFr;
      const minW =
        typeof h.minWidth === "number"
          ? h.minWidth
          : typeof h.minWidth === "string"
            ? parseFloat(String(h.minWidth)) || 0
            : 0;
      const width = minW > 0 ? Math.max(frAssigned, minW) : frAssigned;
      widthMap.set(h.accessor as string, width);
    } else if (spec.type === "pct")
      widthMap.set(h.accessor as string, (total * spec.value) / 100);
    else
      widthMap.set(h.accessor as string, TABLE_HEADER_CELL_WIDTH_DEFAULT);
  });
  return widthMap;
}

function sumWidthMap(map: Map<string, number>): number {
  let sum = 0;
  map.forEach((w) => (sum += w));
  return sum;
}

/**
 * Normalize header widths so that fr and % are converted to pixels.
 * Call this as soon as headers are received so the rest of the code can assume numeric widths.
 * If totalWidth is not provided, a reasonable total is computed from fixed widths + default for fr columns.
 * If options.containerWidth is provided, all fr/% columns are resolved against the full container width,
 * so pinned and non-pinned fr columns share the same proportional pool.
 */
export function normalizeHeaderWidths(
  headers: HeaderObject[],
  totalWidthOrOptions?: number | { containerWidth: number },
): HeaderObject[] {
  const containerWidth =
    typeof totalWidthOrOptions === "object" && totalWidthOrOptions != null
      ? totalWidthOrOptions.containerWidth
      : undefined;
  let totalWidth =
    typeof totalWidthOrOptions === "number" ? totalWidthOrOptions : undefined;

  let widthMap: Map<string, number>;

  if (containerWidth != null && containerWidth > 0) {
    const allLeaves = getLeafHeadersForNormalization(headers);
    widthMap = buildSectionWidthMap(allLeaves, containerWidth);
  } else {
    const leaves = getLeafHeadersForNormalization(headers);
    const specs = leaves.map((h) => parseWidthSpec(h));

    let total = totalWidth;
    if (total == null || total <= 0) {
      const fixedSum = specs.reduce(
        (sum, s) => (s?.type === "px" ? sum + s.value : sum),
        0,
      );
      const frCount = specs.filter((s) => s?.type === "fr").length;
      const pctCount = specs.filter((s) => s?.type === "pct").length;
      total =
        fixedSum +
        (frCount > 0 ? frCount * DEFAULT_FR_PX : 0) +
        (pctCount > 0 ? DEFAULT_TABLE_WIDTH * 0.2 : 0);
      total = Math.max(total, DEFAULT_TABLE_WIDTH);
    }

    widthMap = buildSectionWidthMap(leaves, total);
  }

  function process(h: HeaderObject): HeaderObject {
    const next = { ...h };
    // Apply before recursing so `singleRowChildren` parents (visible leaves
    // that still have children) receive their normalized pixel width.
    const px = widthMap.get(h.accessor as string);
    if (px != null) next.width = px;
    if (h.children && h.children.length > 0) {
      next.children = h.children.map(process);
    }
    return next;
  }
  return headers.map(process);
}

/**
 * Get actual width of a header in pixels
 */
export const getHeaderWidthInPixels = (header: HeaderObject): number => {
  // Headers excluded from the rendered table (hidden or export-only) take up no
  // rendered width; see findLeafHeaders for why this matters for row width.
  if (header.hide || header.excludeFromRender) {
    return 0;
  }

  // If width is a number, use it directly
  if (typeof header.width === "number") {
    return header.width;
  }
  // If width is a string that ends with "px", parse it
  else if (typeof header.width === "string" && header.width.endsWith("px")) {
    return parseFloat(header.width);
  }
  // For fr, %, or any other format, get the actual DOM element width
  else {
    const cellElement = document.getElementById(
      getCellId({ accessor: header.accessor, rowId: "header" }),
    );
    return cellElement?.offsetWidth || TABLE_HEADER_CELL_WIDTH_DEFAULT;
  }
};

/**
 * Convert fractional widths to pixel values
 */
export const removeAllFractionalWidths = (header: HeaderObject): void => {
  const headerWidth = header.width;
  if (typeof headerWidth === "string" && headerWidth.includes("fr")) {
    header.width =
      document.getElementById(getCellId({ accessor: header.accessor, rowId: "header" }))
        ?.offsetWidth || TABLE_HEADER_CELL_WIDTH_DEFAULT;
  }
  if (header.children && header.children.length > 0) {
    header.children.forEach((child) => {
      removeAllFractionalWidths(child);
    });
  }
};

/**
 * Calculate the minimum width for a header
 */
export const getHeaderMinWidth = (header: HeaderObject): number => {
  return typeof header.minWidth === "number" ? header.minWidth : MIN_COLUMN_WIDTH;
};

/**
 * Get all visible leaf headers from an array of headers
 */
export const getAllVisibleLeafHeaders = (
  headers: HeaderObject[],
  collapsedHeaders?: Set<Accessor>,
): HeaderObject[] => {
  const leafHeaders: HeaderObject[] = [];
  headers.forEach((header) => {
    if (!header.hide) {
      leafHeaders.push(...findLeafHeaders(header, collapsedHeaders));
    }
  });
  return leafHeaders;
};

/** Resolve the hidden-measurement host element for a table's style root. */
const getMeasurementHost = (domQueryRoot: ParentNode): HTMLElement =>
  domQueryRoot instanceof HTMLElement ? domQueryRoot : document.body;

/**
 * Escape a value for use inside a double-quoted CSS attribute selector.
 * (`CSS.escape` is not available in jsdom, so quoted-string escaping is used.)
 */
const escapeAttrValue = (value: string): string => value.replace(/["\\]/g, "\\$&");

/**
 * Split text into display lines for width measurement. Explicit newlines
 * (common in multi-line `valueFormatter` output) define the lines that wrap
 * under `white-space: pre-line` / `pre-wrap`; measuring the full string with
 * `white-space: nowrap` collapses those newlines to spaces and over-allocates.
 */
const splitTextLinesForWidth = (text: string): string[] => {
  if (!text.includes("\n") && !text.includes("\r")) return [text];
  return text.split(/\r\n|\r|\n/);
};

/**
 * Measure a text string off-screen using the font metrics (and padding) of a
 * reference element. Used for the default header label pass and as the
 * fallback when a custom header's markup cannot be measured yet (e.g. a React
 * portal target that has not mounted).
 *
 * When `text` contains newlines, returns the width of the longest line so
 * multi-line formatted content does not inflate the column to the collapsed
 * single-line width.
 */
const measureTextWithFont = (text: string, fontSource: HTMLElement): number => {
  const tempSpan = document.createElement("span");
  tempSpan.style.visibility = "hidden";
  tempSpan.style.position = "absolute";
  tempSpan.style.whiteSpace = "nowrap";
  tempSpan.style.width = "auto";

  const sourceStyle = window.getComputedStyle(fontSource);
  tempSpan.style.font = sourceStyle.font;
  tempSpan.style.fontSize = sourceStyle.fontSize;
  tempSpan.style.fontWeight = sourceStyle.fontWeight;
  tempSpan.style.fontFamily = sourceStyle.fontFamily;
  tempSpan.style.letterSpacing = sourceStyle.letterSpacing;
  tempSpan.style.padding = sourceStyle.padding;

  document.body.appendChild(tempSpan);

  let width = 0;
  for (const line of splitTextLinesForWidth(text)) {
    tempSpan.textContent = line;
    width = Math.max(width, tempSpan.offsetWidth);
  }

  document.body.removeChild(tempSpan);
  return width;
};

/**
 * Measure a rendered cell content element's NATURAL (unconstrained) width by
 * cloning it into a hidden max-content holder. This is how custom-renderer
 * output that mounts asynchronously (React portals) is measured: the clone is
 * freed from the live cell's box constraints, so content that truncates itself
 * internally (min-width:0 / overflow:hidden / text-overflow:ellipsis) still
 * reports its full content width — and the result does not depend on the
 * current (provisional) column width.
 */
const measureCellContentClone = (
  contentElement: HTMLElement,
  domQueryRoot: ParentNode,
): number => {
  const holder = document.createElement("div");
  holder.style.visibility = "hidden";
  holder.style.position = "absolute";
  holder.style.top = "-99999px";
  holder.style.left = "-99999px";
  holder.style.whiteSpace = "nowrap";
  holder.style.width = "max-content";

  const clone = contentElement.cloneNode(true) as HTMLElement;
  // Neutralize the live cell's fill/clip styles so the clone sizes to content.
  // Padding is zeroed because the caller adds the sampled cell padding itself.
  clone.style.flex = "none";
  clone.style.width = "max-content";
  clone.style.minWidth = "0";
  clone.style.maxWidth = "none";
  clone.style.overflow = "visible";
  clone.style.padding = "0";

  // The clone is not inside a .st-cell, so copy the content's inherited font
  // to keep text metrics accurate.
  const contentStyle = window.getComputedStyle(contentElement);
  clone.style.font = contentStyle.font;
  clone.style.fontSize = contentStyle.fontSize;
  clone.style.fontFamily = contentStyle.fontFamily;
  clone.style.letterSpacing = contentStyle.letterSpacing;

  holder.appendChild(clone);
  const host = getMeasurementHost(domQueryRoot);
  host.appendChild(holder);
  const width = holder.offsetWidth;
  host.removeChild(holder);
  return width;
};

/**
 * Measure a header label's full content width by cloning it into a hidden,
 * max-content-sized holder. Used for custom `headerRenderer` markup, which can
 * contain arbitrary elements (badges, icons, custom fonts) that the plain
 * text-span measurement cannot see — the label is measured generically, the
 * same way a cell with a custom renderer is. The holder is appended inside the
 * table root so scoped theme CSS still applies to the clone.
 */
const measureHeaderLabelContent = (
  labelElement: HTMLElement,
  domQueryRoot: ParentNode,
): number => {
  const holder = document.createElement("div");
  holder.style.visibility = "hidden";
  holder.style.position = "absolute";
  holder.style.top = "-99999px";
  holder.style.left = "-99999px";
  holder.style.whiteSpace = "nowrap";
  holder.style.width = "max-content";

  const clone = labelElement.cloneNode(true) as HTMLElement;
  // Neutralize the live label's fill/clip styles so the clone sizes to content.
  clone.style.flex = "none";
  clone.style.width = "max-content";
  clone.style.minWidth = "0";
  clone.style.maxWidth = "none";
  clone.style.overflow = "visible";
  clone.style.height = "auto";

  // The clone is not inside a .st-header-cell, so copy the label's inherited
  // font (e.g. the header's bold weight) to keep text metrics accurate.
  const labelStyle = window.getComputedStyle(labelElement);
  clone.style.font = labelStyle.font;
  clone.style.fontSize = labelStyle.fontSize;
  clone.style.fontWeight = labelStyle.fontWeight;
  clone.style.fontFamily = labelStyle.fontFamily;
  clone.style.letterSpacing = labelStyle.letterSpacing;

  holder.appendChild(clone);
  const host = getMeasurementHost(domQueryRoot);
  host.appendChild(holder);
  const width = holder.offsetWidth;
  host.removeChild(holder);
  return width;
};

/**
 * Measure the rendered width (incl. margins + a small padding buffer) a header
 * icon will occupy. Rendered off-screen inside the table root with the real
 * icon-container class(es) so theme CSS (margins, em-based sizing) applies.
 */
const measureHeaderIconWidth = (
  icon: string | HTMLElement | SVGSVGElement,
  domQueryRoot: ParentNode,
  className = "st-icon-container",
): number => {
  const container = document.createElement("div");
  container.className = className;
  container.style.visibility = "hidden";
  container.style.position = "absolute";
  container.style.top = "-99999px";
  container.style.left = "-99999px";
  if (typeof icon === "string") {
    container.innerHTML = icon;
  } else {
    container.appendChild(icon.cloneNode(true) as HTMLElement);
  }
  const host = getMeasurementHost(domQueryRoot);
  host.appendChild(container);
  const style = window.getComputedStyle(container);
  const width =
    container.offsetWidth +
    (parseFloat(style.marginLeft) || 0) +
    (parseFloat(style.marginRight) || 0);
  host.removeChild(container);
  return width + AUTO_SIZE_HEADER_ICON_PADDING;
};

/**
 * Calculate the optimal width for a column by measuring both header and cell content
 * This is used for auto-sizing columns to fit their content (like Excel/Google Sheets)
 *
 * @param accessor - The accessor of the header to measure
 * @param options - Configuration options
 * @returns The optimal width in pixels
 */
export const calculateHeaderContentWidth = (
  accessor: Accessor,
  options?: {
    rows?: any[]; // Array of row data to sample
    header?: HeaderObject; // Header object for valueFormatter/valueGetter/cellRenderer
    maxWidth?: number; // Maximum width hard cap (default: AUTO_SIZE_MAX_WIDTH)
    /** Leading rows always measured (default AUTO_SIZE_HEAD_SAMPLE_SIZE) */
    headSampleSize?: number;
    /** Rows sampled at an even stride across the rest (default AUTO_SIZE_STRIDED_SAMPLE_SIZE) */
    stridedSampleSize?: number;
    /** Back-compat: when set, used as the head sample size (strided defaults to 0) */
    sampleSize?: number;
    /** Outlier clip percentile (default AUTO_SIZE_OUTLIER_PERCENTILE) */
    outlierPercentile?: number;
    /** Outlier clip threshold fraction (default AUTO_SIZE_OUTLIER_THRESHOLD) */
    outlierThreshold?: number;
    /** When "header", ignore cell content and fit the header label only */
    autoSizeMode?: "content" | "header";
    /** Theme passed to a custom cellRenderer during measurement */
    theme?: any;
    /** Scope `.st-cell-content` font/padding sampling to this table instance */
    styleRoot?: ParentNode | null;
    /**
     * The table's resolved sort icon. Used to reserve space on sortable columns
     * that are not currently sorted (the icon only exists on the active sort
     * column), so sorting later does not push the label into ellipsis.
     */
    sortIcon?: string | HTMLElement | SVGSVGElement;
    /**
     * The table's resolved expand/collapse icon. Used to reserve space on
     * collapsible headers when the header cell is virtualized out of the
     * horizontal band (so the icon is not in the DOM to measure directly).
     */
    expandIcon?: string | HTMLElement | SVGSVGElement;
    /**
     * Called before a temporary measure host from `cellRenderer` is discarded.
     * Framework adapters (React portals, Vue/Solid mounts) register on render;
     * without this, autofit sampling leaks those registrations.
     */
    onRendererHostDiscard?: (host: HTMLElement) => void;
  },
): number => {
  const {
    rows,
    header,
    maxWidth = AUTO_SIZE_MAX_WIDTH,
    headSampleSize,
    stridedSampleSize,
    sampleSize,
    outlierPercentile,
    outlierThreshold,
    autoSizeMode = header?.autoSizeMode ?? "content",
    theme,
    styleRoot,
    sortIcon,
    expandIcon,
    onRendererHostDiscard,
  } = options || {};
  const headSize = headSampleSize ?? sampleSize ?? AUTO_SIZE_HEAD_SAMPLE_SIZE;
  const stridedSize =
    stridedSampleSize ?? (sampleSize != null ? 0 : AUTO_SIZE_STRIDED_SAMPLE_SIZE);
  const domQueryRoot: ParentNode = styleRoot ?? document;
  // Get the header cell element from the DOM. Scope the lookup to the table's
  // style root when available so multiple tables with the same accessors on
  // one page never measure each other's cells.
  const cellId = getCellId({ accessor, rowId: "header" });
  const headerCellElement =
    domQueryRoot instanceof HTMLElement
      ? (domQueryRoot.querySelector(
          `[id="${escapeAttrValue(cellId)}"]`,
        ) as HTMLElement | null)
      : document.getElementById(cellId);

  // When this column's header cell is not rendered (virtualized out of the
  // horizontal band), borrow style metrics (padding/gap/font) from any
  // rendered header cell instead of bailing to the default width — the
  // computed width must depend on the column's CONTENT, not on whether the
  // column happens to be inside the current viewport.
  const styleProxyCell =
    headerCellElement ??
    (domQueryRoot.querySelector(".st-header-cell") as HTMLElement | null);

  if (!styleProxyCell) {
    return TABLE_HEADER_CELL_WIDTH_DEFAULT;
  }

  // Get the computed styles to access padding and gap
  const computedStyle = window.getComputedStyle(styleProxyCell);
  const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
  const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
  const gap = parseFloat(computedStyle.gap) || 0;

  // Initialize total width with padding
  let totalWidth = paddingLeft + paddingRight;

  // Measure the actual text content width
  const headerLabelElement = headerCellElement?.querySelector(
    ".st-header-label",
  ) as HTMLElement | null;
  // Whether a sort / collapse icon is already part of the measured header
  // (either inside a custom label or as a direct icon child); used for the
  // reservations below.
  let sortIconMeasured = false;
  let collapseIconMeasured = false;
  if (headerLabelElement) {
    const textSpan = headerLabelElement.querySelector(".st-header-label-text") as HTMLElement;
    if (header?.headerRenderer || !textSpan) {
      // Custom headerRenderer markup (or a header without the default text
      // span): the label can contain arbitrary elements the text-span pass
      // cannot see, so measure the whole label generically — the header is
      // treated like a cell with a custom renderer.
      const customLabelWidth = measureHeaderLabelContent(headerLabelElement, domQueryRoot);
      if (customLabelWidth >= 1) {
        totalWidth += customLabelWidth;
        sortIconMeasured = Boolean(
          headerLabelElement.querySelector('.st-icon-container[aria-label^="Sort"]'),
        );
        collapseIconMeasured = Boolean(
          headerLabelElement.querySelector(".st-collapsible-header-icon"),
        );
      } else if (header?.label) {
        // The custom markup measures as empty — typically an async-mounted
        // renderer (React portal target not filled yet). Fall back to the
        // plain label text so the column doesn't collapse to the minimum
        // (most visible with no rows, where the header is all there is).
        const fontSource =
          (domQueryRoot.querySelector(".st-header-label-text") as HTMLElement | null) ??
          headerLabelElement;
        totalWidth += measureTextWithFont(String(header.label), fontSource);
      }
    } else {
      totalWidth += measureTextWithFont(textSpan.textContent ?? "", textSpan);
    }
  } else if (header?.label) {
    // No rendered header cell for this column: measure the label text using
    // another header's font so the result matches a rendered measurement.
    const fontSource =
      (domQueryRoot.querySelector(".st-header-label-text") as HTMLElement | null) ??
      styleProxyCell;
    totalWidth += measureTextWithFont(String(header.label), fontSource);
  }

  // Loop through all direct children to measure icons (only possible when the
  // header cell is actually rendered)
  const children = headerCellElement ? Array.from(headerCellElement.children) : [];
  let visibleItemCount = 1; // Start with 1 for the text we already measured

  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement;

    // Skip the header label (we already measured its text)
    if (child.classList.contains("st-header-label")) {
      continue;
    }

    // Don't skip the resize handle - it contributes to the content width
    // (even though it's positioned, it still takes up visual space)

    // Skip screen reader only elements (visually hidden)
    if (child.classList.contains("st-sr-only")) {
      continue;
    }

    // Get the computed styles for this child
    const childStyle = window.getComputedStyle(child);

    // Skip if display is none
    if (childStyle.display === "none") {
      continue;
    }

    // Get the width of the child element (icons)
    const childWidth = child.offsetWidth || 0;

    // Get margins
    const marginLeft = parseFloat(childStyle.marginLeft) || 0;
    const marginRight = parseFloat(childStyle.marginRight) || 0;

    // Add child width and margins to total
    totalWidth += childWidth + marginLeft + marginRight;
    visibleItemCount++;

    if (child.getAttribute("aria-label")?.startsWith("Sort")) {
      sortIconMeasured = true;
    }
    if (child.classList.contains("st-collapsible-header-icon")) {
      collapseIconMeasured = true;
    }
  }

  // Reserve space for the sort icon on sortable columns that are not currently
  // sorted. The icon only exists on the actively sorted column and sorting does
  // not re-fit auto columns (widths must stay stable across sorts), so without
  // this reservation the label would be pushed into ellipsis on first sort.
  if (header?.isSortable && !sortIconMeasured && sortIcon) {
    totalWidth += measureHeaderIconWidth(sortIcon, domQueryRoot);
    visibleItemCount++;
  }

  // Reserve space for the collapse/expand icon on collapsible headers when the
  // icon was not already measured (header virtualized out, or not yet painted).
  // Without this, long labels truncate once the column scrolls into view.
  if (header && hasCollapsibleChildren(header) && !collapseIconMeasured && expandIcon) {
    totalWidth += measureHeaderIconWidth(
      expandIcon,
      domQueryRoot,
      "st-icon-container st-collapsible-header-icon st-expand-icon-container expanded",
    );
    visibleItemCount++;
  }

  // Add gaps between items (n-1 gaps for n items)
  if (gap > 0 && visibleItemCount > 1) {
    const gapTotal = gap * (visibleItemCount - 1);
    totalWidth += gapTotal;
  }

  // Now measure cell content widths from row data
  let cellContentWidth = 0;

  // For chart columns, skip cell content measurement and use a minimum width
  const isChartColumn = header && header.type && CHART_COLUMN_TYPES.includes(header.type as any);

  if (rows && rows.length > 0 && !isChartColumn && autoSizeMode !== "header") {
    // Hidden, off-screen measurement container (never touches the visible table,
    // so resolving widths before paint produces no flicker).
    const tempDiv = document.createElement("div");
    tempDiv.style.visibility = "hidden";
    tempDiv.style.position = "absolute";
    tempDiv.style.top = "-99999px";
    tempDiv.style.left = "-99999px";
    tempDiv.style.whiteSpace = "nowrap";
    tempDiv.style.width = "auto";
    tempDiv.style.display = "inline-block";

    // Copy font styles + padding from a sample cell content span so measured
    // text matches the real cell font.
    let cellPaddingLeft = 0;
    let cellPaddingRight = 0;
    const sampleCellContent = domQueryRoot.querySelector(
      ".st-cell-content",
    ) as HTMLElement | null;
    if (sampleCellContent) {
      const cellStyle = window.getComputedStyle(sampleCellContent);
      tempDiv.style.font = cellStyle.font;
      tempDiv.style.fontSize = cellStyle.fontSize;
      tempDiv.style.fontFamily = cellStyle.fontFamily;
      cellPaddingLeft = parseFloat(cellStyle.paddingLeft) || 0;
      cellPaddingRight = parseFloat(cellStyle.paddingRight) || 0;
    }

    document.body.appendChild(tempDiv);

    const sampleWidths: number[] = [];

    // Measure each explicit line separately. `white-space: nowrap` on the
    // measurement node collapses `\n` to spaces, so a multi-line
    // valueFormatter string would otherwise report the full concatenated
    // width even when the rendered cell wraps to the longest line.
    const measureText = (text: string): number => {
      let contentWidth = 0;
      for (const line of splitTextLinesForWidth(text)) {
        tempDiv.textContent = line;
        contentWidth = Math.max(contentWidth, tempDiv.offsetWidth);
      }
      return contentWidth + cellPaddingLeft + cellPaddingRight;
    };

    const sampleIndices = buildHybridSampleIndices(rows.length, headSize, stridedSize);
    // Once a framework adapter returns an async portal/mount host, further
    // cellRenderer calls only thrash the bridge (content is never measurable
    // off-screen). Skip them and use formatted text + painted cells instead.
    let skipAsyncCellRenderer = false;

    for (const i of sampleIndices) {
      const row = rows[i];

      // Resolve the raw value (valueGetter or nested accessor)
      let value;
      if (header?.valueGetter) {
        value = header.valueGetter({ accessor, row, rowIndex: i });
      } else {
        value = getNestedValue(row, accessor);
      }

      // Formatted value (used both for text fallback and passed to cellRenderer)
      let formattedValue: any = value;
      if (header?.valueFormatter && value !== null && value !== undefined) {
        formattedValue = header.valueFormatter({
          accessor,
          colIndex: 0,
          row,
          rowIndex: i,
          value,
        });
      }

      let measured = -1;

      // Custom renderer: measure the REAL rendered output (icons, badges, custom
      // fonts). Vanilla renderers return a string/number/Node we can measure
      // directly. React renderers return a fragment whose portal mounts
      // asynchronously and measures as ~0 here; in that case we fall back to the
      // formatted-text path below (and the rendered visible cells captured later).
      if (header?.cellRenderer && !skipAsyncCellRenderer) {
        try {
          const rendered = header.cellRenderer({
            accessor,
            colIndex: 0,
            row,
            rowIndex: i,
            theme,
            value,
            formattedValue,
          } as any);

          if (typeof rendered === "string" || typeof rendered === "number") {
            measured = measureText(String(rendered));
          } else if (rendered instanceof Node) {
            const isAsyncRendererHost =
              rendered instanceof HTMLElement &&
              (rendered.hasAttribute("data-st-portal-id") ||
                rendered.hasAttribute("data-st-mount-id") ||
                !!rendered.querySelector?.("[data-st-portal-id], [data-st-mount-id]"));

            // Framework adapters register portals/mounts synchronously but fill
            // content asynchronously — off-screen measure is ~0. Dispose the
            // registration immediately so autofit sampling cannot leak entries
            // into the host bridge, then fall back to formatted text + painted cells.
            if (isAsyncRendererHost) {
              if (rendered instanceof HTMLElement) {
                onRendererHostDiscard?.(rendered);
              }
              skipAsyncCellRenderer = true;
              measured = -1;
            } else {
              tempDiv.textContent = "";
              tempDiv.appendChild(rendered);
              const w = tempDiv.offsetWidth + cellPaddingLeft + cellPaddingRight;
              if (rendered instanceof HTMLElement) {
                onRendererHostDiscard?.(rendered);
              }
              tempDiv.textContent = "";
              measured = w > cellPaddingLeft + cellPaddingRight ? w : -1;
            }
          }
        } catch {
          measured = -1;
        }
      }

      if (measured < 0) {
        const textContent = formattedValue != null ? String(formattedValue) : "";
        measured = measureText(textContent);
      }

      sampleWidths.push(measured);
    }

    document.body.removeChild(tempDiv);

    // Also fold in already-rendered (visible) cells — but ONLY for columns with
    // a custom cellRenderer. Renderer output that mounts asynchronously (React
    // portals) measures as empty in the off-screen pass above, so the rendered
    // cells are the only place its real width exists. Each rendered content
    // element is cloned into a hidden max-content holder, which measures the
    // content's NATURAL width: content that truncates itself internally
    // (min-width:0 / overflow:hidden / text-overflow:ellipsis) still reports
    // its full width, and the result does not depend on the current
    // (provisional) column width. Plain columns are fully covered by the
    // deterministic off-screen pass; folding in DOM-dependent samples for them
    // would make the width vary with which rows happen to be rendered
    // (i.e. with the container size).
    if (header?.cellRenderer) {
      const renderedCells = domQueryRoot.querySelectorAll(
        `.st-cell[data-accessor="${escapeAttrValue(String(accessor))}"] .st-cell-content`,
      );
      renderedCells.forEach((node) => {
        const el = node as HTMLElement;
        // Skip loading skeletons — their width is a placeholder, not content.
        if (el.querySelector(".st-loading-skeleton")) return;
        const naturalWidth = measureCellContentClone(el, domQueryRoot);
        // Empty (not-yet-mounted portal) content measures 0 — nothing to learn.
        if (naturalWidth > 0) {
          sampleWidths.push(naturalWidth + cellPaddingLeft + cellPaddingRight);
        }
      });
    }

    cellContentWidth = selectContentWidthWithOutlierClip(sampleWidths, {
      percentile: outlierPercentile,
      threshold: outlierThreshold,
    });
  }

  // In header-only mode the cell content is ignored entirely.
  let optimalWidth = autoSizeMode === "header" ? totalWidth : Math.max(totalWidth, cellContentWidth);

  // For chart columns, apply a minimum width
  if (isChartColumn) {
    optimalWidth = Math.max(optimalWidth, OPTIMAL_CHART_COLUMN_WIDTH);
  }

  // Apply max width hard cap (per-column maxWidth wins when provided)
  const headerMaxWidth =
    typeof header?.maxWidth === "number"
      ? header.maxWidth
      : typeof header?.maxWidth === "string"
        ? parseFloat(String(header.maxWidth)) || undefined
        : undefined;
  const effectiveMaxWidth = headerMaxWidth != null ? headerMaxWidth : maxWidth;
  if (optimalWidth > effectiveMaxWidth) {
    optimalWidth = effectiveMaxWidth;
  }

  // Floor at the column's min width (or the global minimum)
  const headerMinWidth =
    typeof header?.minWidth === "number"
      ? header.minWidth
      : typeof header?.minWidth === "string"
        ? parseFloat(String(header.minWidth)) || MIN_COLUMN_WIDTH
        : MIN_COLUMN_WIDTH;

  return Math.max(optimalWidth + AUTO_SIZE_WIDTH_BUFFER, headerMinWidth, MIN_COLUMN_WIDTH);
};
