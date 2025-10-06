import { HeaderObject } from "..";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import TableRow from "./TableRow";

interface TableBodyProps {
  currentVisibleRows: TableRow[];
  rowsEnteringTheDom: TableRow[];
  rowsLeavingTheDom: TableRow[];
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  setScrollTop: Dispatch<SetStateAction<number>>;
  tableRows: TableRow[];
}

export default TableBodyProps;
