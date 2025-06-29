import { ReactNode } from "react";
import Row from "./Row";
import { Pinned } from "./Pinned";
import Theme from "./Theme";
import EnumOption from "./EnumOption";
import { AggregationConfig } from "./AggregationTypes";

type HeaderObject = {
  accessor: string;
  aggregation?: AggregationConfig;
  align?: "left" | "center" | "right";
  cellRenderer?: ({
    accessor,
    colIndex,
    row,
  }: {
    accessor: string;
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
    accessor: string;
    colIndex: number;
    header: HeaderObject;
  }) => ReactNode | string;
  hide?: boolean;
  isEditable?: boolean;
  isSortable?: boolean;
  label: string;
  minWidth?: number | string;
  pinned?: Pinned;
  type?: "string" | "number" | "boolean" | "date" | "enum";
  width: number | string;
};

export default HeaderObject;
