import { ReactNode } from "react";
import Row from "./Row";
import { Pinned } from "./Pinned";
import Theme from "./Theme";

type HeaderObject = {
  accessor: string;
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
  enumOptions?: string[];
  expandable?: boolean;
  filterable?: boolean;
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
