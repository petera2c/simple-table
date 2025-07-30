import { ReactNode } from "react";
import Row from "./Row";
import { Pinned } from "./Pinned";
import Theme from "./Theme";
import EnumOption from "./EnumOption";
import { AggregationConfig } from "./AggregationTypes";
import { CellRenderer } from "./CellRendererProps";
import { HeaderRenderer } from "./HeaderRendererProps";

export type Accessor = keyof Row;
export type ColumnType = "string" | "number" | "boolean" | "date" | "enum" | "other";

type HeaderObject = {
  accessor: Accessor;
  aggregation?: AggregationConfig;
  align?: "left" | "center" | "right";
  cellRenderer?: CellRenderer;
  children?: HeaderObject[];
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
  type?: ColumnType;
  width: number | string;
  maxWidth?: number | string;
};

export default HeaderObject;
