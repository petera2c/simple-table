import Row from "./Row";
import { Pinned } from "./Pinned";
import EnumOption from "./EnumOption";
import { AggregationConfig } from "./AggregationTypes";
import { CellRenderer } from "./CellRendererProps";
import { HeaderRenderer } from "./HeaderRendererProps";
import CellValue from "./CellValue";

export type Accessor = keyof Row;
export type ColumnType = "string" | "number" | "boolean" | "date" | "enum" | "other";
export type ShowWhen = "parentCollapsed" | "parentExpanded" | "always";

export interface ValueFormatterProps {
  accessor: Accessor;
  colIndex: number;
  row: Row;
  rowIndex: number;
  value: CellValue;
}

export type ValueFormatter = (props: ValueFormatterProps) => string | number;

// Default showWhen value for child columns when not specified
export const DEFAULT_SHOW_WHEN: ShowWhen = "parentExpanded";

type HeaderObject = {
  accessor: Accessor;
  aggregation?: AggregationConfig;
  align?: "left" | "center" | "right";
  cellRenderer?: CellRenderer;
  children?: HeaderObject[];
  collapsible?: boolean; // This is used to determine if the column is collapsible
  disableReorder?: boolean;
  enumOptions?: EnumOption[];
  expandable?: boolean;
  filterable?: boolean;
  headerRenderer?: HeaderRenderer;
  hide?: boolean;
  isEditable?: boolean; // This is used to determine if the column is editable
  isSelectionColumn?: boolean; // This is a flag for the checkbox select row column
  isSortable?: boolean;
  label: string;
  minWidth?: number | string;
  pinned?: Pinned;
  singleRowChildren?: boolean; // When true, renders parent and children on the same row instead of tree hierarchy
  tooltip?: string; // Optional tooltip text to display on hover
  type?: ColumnType;
  valueFormatter?: ValueFormatter; // Function to format the cell value for display (does not affect underlying data)
  showWhen?: ShowWhen; // Controls when child column is visible based on parent's collapsed state
  width: number | string;
  maxWidth?: number | string;
};

export default HeaderObject;
