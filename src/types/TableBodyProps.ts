import { RefObject } from "react";
import { HeaderObject } from "..";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import TableRow from "./TableRow";

interface TableBodyProps {
  tableRows: TableRow[];
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  setScrollTop: Dispatch<SetStateAction<number>>;
  visibleRows: TableRow[];
}

export default TableBodyProps;
