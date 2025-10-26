import HeaderObject from "./HeaderObject";
import TableRow from "./TableRow";
import Cell from "./Cell";

export interface TableCellProps {
  borderClass?: string;
  colIndex: number;
  displayRowNumber: number;
  header: HeaderObject;
  isHighlighted?: boolean;
  isInitialFocused?: boolean;
  nestedIndex: number;
  rowIndex: number;
  tableRow: TableRow;
}

export default TableCellProps;
