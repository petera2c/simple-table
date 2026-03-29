import HeaderObject from "./HeaderObject";
import TableRow from "./TableRow";

export interface TableCellProps {
  borderClass?: string;
  colIndex: number;
  displayRowNumber: number;
  header: HeaderObject;
  isHighlighted?: boolean;
  isInitialFocused?: boolean;
  nestedIndex: number;
  parentHeader?: HeaderObject;
  rowIndex: number;
  tableRow: TableRow;
}

export default TableCellProps;
