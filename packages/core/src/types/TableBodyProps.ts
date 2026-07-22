import { ColumnDef } from "..";
import TableRow from "./TableRow";
import { CumulativeHeightMap } from "../utils/infiniteScrollUtils";

interface TableBodyProps {
  calculatedHeaderHeight: number;
  heightMap?: CumulativeHeightMap;
  partiallyVisibleRows: TableRow[];
  pinnedLeftColumns: ColumnDef[];
  pinnedLeftWidth: number;
  pinnedRightColumns: ColumnDef[];
  pinnedRightWidth: number;
  regularRows: TableRow[];
  rowsToRender: TableRow[];
  setScrollDirection: (direction: "up" | "down" | "none") => void;
  setScrollTop: (scrollTop: number) => void;
  shouldShowEmptyState: boolean;
  stickyParents: TableRow[];
  tableRows: TableRow[];
}

export default TableBodyProps;
