import Row from "./Row";
import { Pinned } from "./Pinned";
import EnumOption from "./EnumOption";
import { AggregationConfig } from "./AggregationTypes";
import { CellRenderer } from "./CellRendererProps";
import { HeaderRenderer } from "./HeaderRendererProps";
import CellValue from "./CellValue";
import { SimpleTableProps } from "./SimpleTableProps";
import { QuickFilterGetter } from "./QuickFilterTypes";
import type { FilterOperator } from "./FilterTypes";
export type Accessor = keyof Row | string;
export type ColumnType = "string" | "number" | "boolean" | "date" | "enum" | "lineAreaChart" | "barChart" | "other";
export type ShowWhen = "parentCollapsed" | "parentExpanded" | "always";
/**
 * Controls what an auto-sized column (`width: "auto"`) fits to:
 * - "content" (default): fit the wider of the header and the sampled cell content
 * - "header": fit the header label only (ignore cell content)
 */
export type AutoSizeMode = "content" | "header";
export interface ChartOptions {
    min?: number;
    max?: number;
    width?: number;
    height?: number;
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    strokeWidth?: number;
    gap?: number;
}
export interface ValueFormatterProps {
    accessor: Accessor;
    colIndex: number;
    row: Row;
    rowIndex: number;
    value: CellValue;
}
export type ValueFormatter = (props: ValueFormatterProps) => string | number | string[] | number[];
export interface ValueGetterProps {
    accessor: Accessor;
    row: Row;
    rowIndex: number;
}
export type ValueGetter = (props: ValueGetterProps) => CellValue;
export interface ComparatorProps {
    rowA: Row;
    rowB: Row;
    valueA: CellValue;
    valueB: CellValue;
    direction: "asc" | "desc";
}
export type Comparator = (props: ComparatorProps) => number;
export interface ExportValueProps {
    accessor: Accessor;
    colIndex: number;
    row: Row;
    rowIndex: number;
    value: CellValue;
    formattedValue?: string | number | string[] | number[];
}
export type ExportValueGetter = (props: ExportValueProps) => string | number;
export declare const DEFAULT_SHOW_WHEN: ShowWhen;
type HeaderObject = {
    accessor: Accessor;
    aggregation?: AggregationConfig;
    align?: "left" | "center" | "right";
    /**
     * When `width` is the string `"auto"`, the column is sized to fit its content
     * on load (and re-fit when row data changes). `autoSizeMode` controls whether
     * it fits the header + cells (`"content"`, default) or the header label only
     * (`"header"`). `minWidth` / `maxWidth` clamp the computed width.
     */
    autoSizeMode?: AutoSizeMode;
    cellRenderer?: CellRenderer;
    chartOptions?: ChartOptions;
    children?: HeaderObject[];
    collapsible?: boolean;
    collapseDefault?: boolean;
    comparator?: Comparator;
    disableReorder?: boolean;
    enumOptions?: EnumOption[];
    expandable?: boolean;
    exportValueGetter?: ExportValueGetter;
    filterable?: boolean;
    /**
     * Restricts which filter operators are shown in this column's filter dropdown.
     * Only operators valid for the column's `type` are honored, and they appear in
     * the order provided here. When omitted, all operators for the column type are
     * shown. Has no effect on `enum` columns (which use a checkbox value picker
     * instead of an operator dropdown).
     *
     * @example
     * // String column limited to "contains" and "equals"
     * { accessor: "name", type: "string", filterable: true,
     *   filterOperators: ["contains", "equals"] }
     */
    filterOperators?: FilterOperator[];
    headerRenderer?: HeaderRenderer;
    hide?: boolean;
    isEditable?: boolean;
    excludeFromRender?: boolean;
    excludeFromCsv?: boolean;
    isSelectionColumn?: boolean;
    /** When true, column stays visible, cannot be unpinned from a pinned side, cannot reorder above non-essentials in its section */
    isEssential?: boolean;
    isSortable?: boolean;
    label: string;
    minWidth?: number | string;
    sortingOrder?: ("asc" | "desc" | null)[];
    nestedTable?: Omit<SimpleTableProps, "rows" | "loadingStateRenderer" | "errorStateRenderer" | "emptyStateRenderer" | "tableEmptyStateRenderer">;
    pinned?: Pinned;
    quickFilterable?: boolean;
    quickFilterGetter?: QuickFilterGetter;
    singleRowChildren?: boolean;
    tooltip?: string;
    type?: ColumnType;
    useFormattedValueForClipboard?: boolean;
    useFormattedValueForCSV?: boolean;
    valueFormatter?: ValueFormatter;
    valueGetter?: ValueGetter;
    showWhen?: ShowWhen;
    /**
     * Column width. A number or px/fr/% string sets a fixed/proportional width.
     * The special value `"auto"` sizes the column to fit its content (see
     * `autoSizeMode`). With `autoExpandColumns`, the fixed/measured width acts
     * as the column's natural width: it can stretch to help fill surplus
     * container space but is never squeezed narrower (the table scrolls
     * horizontally instead).
     */
    width: number | string;
    maxWidth?: number | string;
};
export default HeaderObject;
