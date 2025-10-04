import { RefObject } from "react";
import { HeaderObject } from "..";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import TableRow from "./TableRow";

interface TableBodyProps {
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  rowsToRender: TableRow[];
  alreadyRenderedRows: TableRow[];
  enteringDomRows: TableRow[];
  setScrollTop: Dispatch<SetStateAction<number>>;
  tableRows: TableRow[];
}

export default TableBodyProps;
