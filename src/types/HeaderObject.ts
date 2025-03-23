import { ReactNode } from "react";
import Row from "./Row";

type HeaderObject = {
  accessor: string;
  align?: "left" | "center" | "right";
  cellRenderer?: (row: Row) => ReactNode;
  expandable?: boolean;
  hide?: boolean;
  isEditable?: boolean;
  isSortable?: boolean;
  label: string;
  pinned?: "left" | "right";
  type?: "string" | "number" | "boolean" | "date" | "enum";
  width: number;
};

export default HeaderObject;
