import Row from "./Row";
import { Pinned } from "./Pinned";
import EnumOption from "./EnumOption";
import { AggregationConfig } from "./AggregationTypes";
import { CellRenderer } from "./CellRendererProps";
import { HeaderRenderer } from "./HeaderRendererProps";
import { ColumnEditorRowRenderer } from "./ColumnEditorRowRendererProps";
import CellValue from "./CellValue";
import { SimpleTableProps } from "./SimpleTableProps";
import { QuickFilterGetter } from "./QuickFilterTypes";

// Accessor can be:
// - A simple key of Row (e.g., "name")
// - A nested path with dots (e.g., "latest.score")
// - A path with array indices (e.g., "albums[0].title" or "releaseDate[0]")
export type Accessor = keyof Row | string;
export type ColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "enum"
  | "lineAreaChart"
  | "barChart"
  | "other";
export type ShowWhen = "parentCollapsed" | "parentExpanded" | "always";

export interface ChartOptions {
  min?: number; // Custom minimum value for chart scaling
  max?: number; // Custom maximum value for chart scaling
  width?: number; // Custom chart width (default: 100)
  height?: number; // Custom chart height (default: 30)
  color?: string; // Custom chart color (overrides theme color)
  fillColor?: string; // Custom fill color for area charts (overrides theme color)
  fillOpacity?: number; // Fill opacity for area charts (default: 0.2)
  strokeWidth?: number; // Line stroke width (default: 2)
  gap?: number; // Gap between bars in bar charts (default: 2)
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

// Default showWhen value for child columns when not specified
export const DEFAULT_SHOW_WHEN: ShowWhen = "parentExpanded";

type HeaderObject = {
  accessor: Accessor;
  aggregation?: AggregationConfig;
  align?: "left" | "center" | "right";
  cellRenderer?: CellRenderer;
  chartOptions?: ChartOptions; // Options for chart rendering (lineAreaChart, barChart)
  children?: HeaderObject[];
  collapsible?: boolean; // This is used to determine if the column is collapsible
  collapseDefault?: boolean; // When true, this column starts collapsed
  columnEditorRowRenderer?: ColumnEditorRowRenderer; // Custom renderer for column editor row layout
  comparator?: Comparator; // Custom sorting function based on row-level metadata
  disableReorder?: boolean;
  enumOptions?: EnumOption[];
  expandable?: boolean; // This is for row grouping
  exportValueGetter?: ExportValueGetter; // Custom function for CSV export values
  filterable?: boolean;
  headerRenderer?: HeaderRenderer;
  hide?: boolean;
  isEditable?: boolean; // This is used to determine if the column is editable
  excludeFromRender?: boolean; // When true, excludes this column from the rendered table (e.g., use only for CSV export)
  excludeFromCsv?: boolean; // When true, excludes this column from the exported CSV file
  isSelectionColumn?: boolean; // This is a flag for the checkbox select row column
  isSortable?: boolean;
  label: string;
  minWidth?: number | string;
  sortingOrder?: ("asc" | "desc" | null)[]; // Custom sorting cycle order for this column (e.g., ["desc", "asc", null] for numbers/dates)
  // Nested grid configuration - when expandable is true and this is set, renders a nested table instead of child rows
  // Omit 'rows' and props that should inherit from parent table
  nestedTable?: Omit<
    SimpleTableProps,
    | "rows"
    | "loadingStateRenderer"
    | "errorStateRenderer"
    | "emptyStateRenderer"
    | "tableEmptyStateRenderer"
    | "expandIcon"
    | "filterIcon"
    | "sortUpIcon"
    | "sortDownIcon"
    | "nextIcon"
    | "prevIcon"
    | "headerCollapseIcon"
    | "headerExpandIcon"
  >;
  pinned?: Pinned;
  quickFilterable?: boolean; // Default: true - whether column is searchable via quick filter
  quickFilterGetter?: QuickFilterGetter; // Custom value extraction for quick filter
  singleRowChildren?: boolean; // When true, renders parent and children on the same row instead of tree hierarchy
  tooltip?: string; // Optional tooltip text to display on hover
  type?: ColumnType;
  useFormattedValueForClipboard?: boolean; // When true, uses valueFormatter output for clipboard copy
  useFormattedValueForCSV?: boolean; // When true, uses valueFormatter output for CSV export (unless exportValueGetter is provided)
  valueFormatter?: ValueFormatter; // Function to format the cell value for display (does not affect underlying data)
  valueGetter?: ValueGetter; // Function to get the value for sorting and operations
  showWhen?: ShowWhen; // Controls when child column is visible based on parent's collapsed state
  width: number | string;
  maxWidth?: number | string;
};

export default HeaderObject;
