export declare const DRAG_THROTTLE_LIMIT = 50;
export declare const ROW_SEPARATOR_WIDTH = 1;
export declare const PAGE_SIZE = 20;
export declare const CSS_VAR_BORDER_WIDTH = "--st-border-width";
export declare const DEFAULT_BORDER_WIDTH = 1;
export declare const VIRTUALIZATION_THRESHOLD = 20;
export declare const UNVIRTUALIZED_ROW_WARNING_THRESHOLD = 500;
export declare const OVERSCAN_PIXELS = 800;
export declare const calculateBufferRowCount: (rowHeight: number) => number;
export declare const COLUMN_EDIT_WIDTH = 29.5;
/**
 * Horizontal space reserved for the built-in column-editor toggle strip.
 * Returns 0 when editing is off or the strip is hidden via `showToggle: false`.
 */
export declare const getColumnEditorStripWidth: (editColumns: boolean | undefined, showToggle?: boolean) => number;
/**
 * Whether the built-in column-editor toggle strip is visible and takes layout space.
 */
export declare const isColumnEditorStripVisible: (editColumns: boolean | undefined, showToggle?: boolean) => boolean;
export declare const TABLE_HEADER_CELL_WIDTH_DEFAULT = 150;
export declare const PINNED_BORDER_WIDTH = 1;
export declare const CHART_COLUMN_TYPES: string[];
export declare const OPTIMAL_CHART_COLUMN_WIDTH = 150;
export declare const AUTO_SIZE_HEAD_SAMPLE_SIZE = 25;
export declare const AUTO_SIZE_STRIDED_SAMPLE_SIZE = 75;
export declare const AUTO_SIZE_MAX_WIDTH = 500;
export declare const AUTO_SIZE_OUTLIER_PERCENTILE = 95;
export declare const AUTO_SIZE_OUTLIER_THRESHOLD = 0.5;
export declare const AUTO_SIZE_MIN_SAMPLE_FOR_CLIP = 20;
export declare const AUTO_SIZE_WIDTH_BUFFER = 2;
/** Extra padding reserved around header icons (sort / collapse) during auto-size. */
export declare const AUTO_SIZE_HEADER_ICON_PADDING = 4;
