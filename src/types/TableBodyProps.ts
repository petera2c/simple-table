import { HeaderObject } from "..";
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
  setScrollTop: (scrollTop: number) => void;
  setScrollDirection: (direction: "up" | "down" | "none") => void;
  tableRows: TableRow[];
}

export default TableBodyProps;
