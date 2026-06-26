import HeaderObject from "./HeaderObject";
import TableRow from "./TableRow";

export interface TableCellProps {
  borderClass?: string;
  colIndex: number;
  displayRowNumber: number;
  /**
   * 1-based CSS grid track to place this cell in. Set when column virtualization is
   * active so that the rendered subset of cells lands in the correct grid columns even
   * though off-screen cells are not mounted. Undefined = natural grid auto-placement.
   */
  gridColumnStart?: number;
  header: HeaderObject;
  isHighlighted?: boolean;
  isInitialFocused?: boolean;
  nestedIndex: number;
  parentHeader?: HeaderObject;
  rowIndex: number;
  tableRow: TableRow;
}

export default TableCellProps;
