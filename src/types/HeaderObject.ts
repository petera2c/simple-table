import { ReactNode } from "react";
import { Pinned } from "./Pinned";
import Theme from "./Theme";
import EnumOption from "./EnumOption";
import { AggregationConfig } from "./AggregationTypes";

export type Accessor<T> = keyof T;
export type ColumnType = "string" | "number" | "boolean" | "date" | "enum" | "other";

type HeaderObject<T> = {
  accessor?: Accessor<T>;
  aggregation?: AggregationConfig;
  align?: "left" | "center" | "right";
  cellRenderer?: ({
    accessor,
    colIndex,
    row,
  }: {
    accessor: Accessor<T>;
    colIndex: number;
    row: T;
    theme: Theme;
  }) => ReactNode | string;
  children?: HeaderObject<T>[];
  disableReorder?: boolean;
  enumOptions?: EnumOption[];
  expandable?: boolean;
  filterable?: boolean;
  headerRenderer?: ({
    accessor,
    colIndex,
    header,
  }: {
    accessor: Accessor<T>;
    colIndex: number;
    header: HeaderObject<T>;
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
