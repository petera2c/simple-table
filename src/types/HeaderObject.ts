import { ReactNode } from "react";

type HeaderObject = {
  accessor: string;
  cellRenderer?: (row: { [key: string]: any }) => ReactNode;
  isEditable?: boolean;
  isSortable?: boolean;
  label: string;
  width: number;
};

export default HeaderObject;
