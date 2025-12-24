import HeaderObject from "./HeaderObject";
import TableRow from "./TableRow";

/**
 * TableCell Props - Only includes dynamic values that change frequently
 * Static/stable values are accessed via useTableStaticContext() inside the component
 * This allows React.memo to work effectively
 */
export interface TableCellProps {
  // Core cell identification props
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

  // Dynamic context values (change frequently, passed as props)
  expandAll: boolean;
  isLoading: boolean;
  rowsWithSelectedCells: Set<string>;
  selectedColumns: Set<number>;
  unexpandedRows: Set<string>;
}

export default TableCellProps;
