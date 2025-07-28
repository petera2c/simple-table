import HeaderObject from "./HeaderObject";
import TableRow from "./TableRow";

export interface TableCellProps<T> {
  borderClass?: string;
  colIndex: number;
  header: HeaderObject<T>;
  isHighlighted?: boolean;
  isInitialFocused?: boolean;
  nestedIndex: number;
  rowIndex: number;
  tableRow: TableRow<T>;
}

export default TableCellProps;
