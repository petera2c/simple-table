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
  shouldShowEmptyState: boolean;
  tableRows: TableRow[];
  stickyParents: TableRow[];
  regularRows: TableRow[];
}

export default TableBodyProps;
