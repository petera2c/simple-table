import { HeaderObject } from "..";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import TableRow from "./TableRow";

interface TableBodyProps<T> {
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject<T>[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject<T>[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  rowsToRender: TableRow<T>[];
  setScrollTop: Dispatch<SetStateAction<number>>;
  tableRows: TableRow<T>[];
}

export default TableBodyProps;
