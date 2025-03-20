import { ReactNode } from "react";

type HeaderObject = {
  accessor: string;
  align?: "left" | "center" | "right";
  cellRenderer?: (row: { [key: string]: any }) => ReactNode;
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
