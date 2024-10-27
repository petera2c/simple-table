import { ReactNode } from "react";

type HeaderObject = {
  accessor: string;
  cellRenderer?: (row: { [key: string]: any }) => ReactNode;
  hide?: boolean;
  isEditable?: boolean;
  isSortable?: boolean;
  label: string;
  type?: "string" | "number" | "boolean" | "date" | "enum";
  width: number;
};

export default HeaderObject;
