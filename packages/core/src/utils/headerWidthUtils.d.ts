import HeaderObject, { Accessor } from "../types/HeaderObject";
/**
 * Build the set of row indices to sample for auto-size measurement.
 * Hybrid strategy: the first `headSize` rows (always include the top / initial
 * viewport) plus `stridedSize` rows spread at an even stride across the rest of
 * the dataset, so wide values deeper in the data are caught without scanning
 * every row. Strided (not random) keeps the result deterministic across renders.
 */
export declare const buildHybridSampleIndices: (rowCount: number, headSize: number, stridedSize: number) => number[];
/** Linear-interpolated percentile (0-100) of a numeric array. */
export declare const percentileOf: (values: number[], percentile: number) => number;
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
export declare const selectContentWidthWithOutlierClip: (widths: number[], options?: {
    percentile?: number;
    threshold?: number;
    minSampleForClip?: number;
}) => number;
/**
 * Find all leaf headers (headers without children) in a header tree
 * Takes collapsed state into account - when a header is collapsed, only returns
 * children that are visible when parent is collapsed (showWhen is 'parentCollapsed' or 'always')
 */
export declare const findLeafHeaders: (header: HeaderObject, collapsedHeaders?: Set<Accessor>) => HeaderObject[];
/** Default pixel width for 1fr when converting before container width is known */
export declare const DEFAULT_FR_PX = 150;
/** Default total table width used when normalizing fr/% if container width unknown */
export declare const DEFAULT_TABLE_WIDTH = 800;
/** True when a header's width requests content-based auto-sizing (`width: "auto"`). */
export declare const isAutoWidth: (header: HeaderObject) => boolean;
/**
 * Normalize header widths so that fr and % are converted to pixels.
 * Call this as soon as headers are received so the rest of the code can assume numeric widths.
 * If totalWidth is not provided, a reasonable total is computed from fixed widths + default for fr columns.
 * If options.containerWidth is provided, all fr/% columns are resolved against the full container width,
 * so pinned and non-pinned fr columns share the same proportional pool.
 */
export declare function normalizeHeaderWidths(headers: HeaderObject[], totalWidthOrOptions?: number | {
    containerWidth: number;
}): HeaderObject[];
/**
 * Get actual width of a header in pixels
 */
export declare const getHeaderWidthInPixels: (header: HeaderObject) => number;
/**
 * Convert fractional widths to pixel values
 */
export declare const removeAllFractionalWidths: (header: HeaderObject) => void;
/**
 * Calculate the minimum width for a header
 */
export declare const getHeaderMinWidth: (header: HeaderObject) => number;
/**
 * Get all visible leaf headers from an array of headers
 */
export declare const getAllVisibleLeafHeaders: (headers: HeaderObject[], collapsedHeaders?: Set<Accessor>) => HeaderObject[];
/**
 * Calculate the optimal width for a column by measuring both header and cell content
 * This is used for auto-sizing columns to fit their content (like Excel/Google Sheets)
 *
 * @param accessor - The accessor of the header to measure
 * @param options - Configuration options
 * @returns Measured width plus whether the result is final (`settled`). When a
 *   custom `cellRenderer` / `headerRenderer` exists but its real DOM is not
 *   measurable yet (async portal / loading skeleton), `settled` is false and
 *   the width is provisional (header / minWidth only — never `valueFormatter`
 *   or plain `label` as a stand-in for renderer output). Callers should apply
 *   that provisional width once and re-measure later via an explicit refit
 *   (rows / isLoading / `refitAutoSizeColumns`) — not by leaving the column
 *   pending across every render.
 */
export declare const calculateHeaderContentWidth: (accessor: Accessor, options?: {
    rows?: any[];
    header?: HeaderObject;
    maxWidth?: number;
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
}) => {
    width: number;
    settled: boolean;
};
