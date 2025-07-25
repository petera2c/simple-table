import { ReactNode } from "react";
import Row from "./Row";
import { Pinned } from "./Pinned";
import Theme from "./Theme";
import EnumOption from "./EnumOption";
import { AggregationConfig } from "./AggregationTypes";

export type Accessor = keyof Row;
export type ColumnType = "string" | "number" | "boolean" | "date" | "enum" | "other";

type HeaderObject = {
  accessor: Accessor;
  aggregation?: AggregationConfig;
  align?: "left" | "center" | "right";
  cellRenderer?: ({
    accessor,
    colIndex,
    row,
  }: {
    accessor: Accessor;
    colIndex: number;
    row: Row;
    theme: Theme;
  }) => ReactNode | string;
  children?: HeaderObject[];
  disableReorder?: boolean;
  enumOptions?: EnumOption[];
  expandable?: boolean;
  filterable?: boolean;
  headerRenderer?: ({
    accessor,
    colIndex,
    header,
  }: {
    accessor: Accessor;
    colIndex: number;
    header: HeaderObject;
  }) => ReactNode | string;
  hide?: boolean;
  isEditable?: boolean;
  isSelectionColumn?: boolean;
  isSortable?: boolean;
  label: string;
  minWidth?: number | string;
  pinned?: Pinned;
  type?: ColumnType;
  width: number | string;
  maxWidth?: number | string;
};

export default HeaderObject;
