import { ReactNode } from "react";
import { Pinned } from "./Pinned";
import EnumOption from "./EnumOption";
import { AggregationConfig } from "./AggregationTypes";
import CellRendererProps from "./CellRendererProps";
import HeaderRendererProps from "./HeaderRendererProps";

// Helper type to extract keys from nested array objects
type NestedArrayObjectKeys<T> = T extends readonly (infer U)[]
  ? U extends object
    ? keyof U | NestedArrayObjectKeys<U[keyof U]>
    : never
  : T extends object
  ? NestedArrayObjectKeys<T[keyof T]>
  : never;

// Helper type to extract all possible field types from nested structures
type NestedFieldTypes<T> = T extends readonly (infer U)[]
  ? U extends object
    ? U[keyof U] | NestedFieldTypes<U[keyof U]>
    : never
  : T extends object
  ? NestedFieldTypes<T[keyof T]>
  : never;

// Type representing what a row looks like after aggregation processing
export type AggregatedRow<T> = T & {
  [K in NestedArrayObjectKeys<T>]?: NestedFieldTypes<T>;
};

// Flattened union type that includes keys from the main type and nested objects
export type Accessor<T> = keyof T | NestedArrayObjectKeys<T>;
export type ColumnType = "string" | "number" | "boolean" | "date" | "enum" | "other";

type HeaderObject<T> = {
  accessor?: Accessor<T>;
  aggregation?: AggregationConfig;
  align?: "left" | "center" | "right";
  cellRenderer?: ({
    accessor,
    colIndex,
    row,
  }: CellRendererProps<AggregatedRow<T>>) => ReactNode | string;
  children?: HeaderObject<T>[];
  disableReorder?: boolean;
  enumOptions?: EnumOption[];
  expandable?: boolean;
  filterable?: boolean;
  headerRenderer?: ({
    accessor,
    colIndex,
    header,
  }: HeaderRendererProps<AggregatedRow<T>>) => ReactNode | string;
  hide?: boolean;
  id: string;
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

// Header object without id
export type STColumn<T> = Omit<HeaderObject<T>, "id" | "children"> & {
  children?: STColumn<T>[];
};

export default HeaderObject;
