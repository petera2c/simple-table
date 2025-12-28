import { HeaderObject } from "..";
import TableRow from "./TableRow";

interface TableBodyProps {
  currentVisibleRows: TableRow[];
  rowsEnteringTheDom: TableRow[];
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  setScrollTop: (scrollTop: number) => void;
  setScrollDirection: (direction: "up" | "down" | "none") => void;
  shouldShowEmptyState: boolean;
  tableRows: TableRow[];
}

export default TableBodyProps;
