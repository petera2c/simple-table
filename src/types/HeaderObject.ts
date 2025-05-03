import { ReactNode } from "react";
import Row from "./Row";
import { Pinned } from "./Pinned";

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
  }) => ReactNode | string;
  children?: HeaderObject[];
  disableReorder?: boolean;
  enumOptions?: string[];
  expandable?: boolean;
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
