import { ReactNode } from "react";

type HeaderObject = {
  label: string;
  accessor: string;
  width: number;
  isEditable?: boolean;
  cellRenderer?: (row: { [key: string]: any }) => ReactNode;
};

export default HeaderObject;
