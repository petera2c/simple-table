import HeaderObject, { Accessor } from "./HeaderObject";
import TableRow from "./TableRow";
import { MutableRefObject, ReactNode } from "react";
import Row from "./Row";
import CellValue from "./CellValue";
import { RowButton } from "./RowButton";
import Theme from "./Theme";

export interface TableCellProps {
  borderClass?: string;
  colIndex: number;
  displayRowNumber: number;
  header: HeaderObject;
  isHighlighted?: boolean;
  isInitialFocused?: boolean;
  nestedIndex: number;
  parentHeader?: HeaderObject;
  rowIdAccessor: Accessor;
  rowIndex: number;
  tableRow: TableRow;

  // Context values passed as props to avoid context re-renders
  // These match the context types - optional ones are truly optional in context
  canExpandRowGroup?: (row: Row) => boolean;
  cellRegistry?: Map<string, { updateContent: (newValue: CellValue) => void }>;
  cellUpdateFlash: boolean;
  columnBorders: boolean;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  enableRowSelection: boolean;
  expandAll: boolean;
  expandIcon: ReactNode;
  handleMouseDown: (props: { rowIndex: number; colIndex: number; rowId: string | number }) => void;
  handleMouseOver: (props: { rowIndex: number; colIndex: number; rowId: string | number }) => void;
  handleRowSelect?: (rowId: string, selected: boolean) => void;
  headers: HeaderObject[];
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  isCopyFlashing: (props: {
    rowIndex: number;
    colIndex: number;
    rowId: string | number;
  }) => boolean;
  isLoading: boolean;
  isRowSelected?: (rowId: string) => boolean;
  isWarningFlashing: (props: {
    rowIndex: number;
    colIndex: number;
    rowId: string | number;
  }) => boolean;
  onCellEdit?: (props: {
    accessor: Accessor;
    newValue: CellValue;
    row: Row;
    rowIndex: number;
  }) => void;
  onCellClick?: (props: {
    accessor: Accessor;
    colIndex: number;
    row: Row;
    rowId: string | number;
    rowIndex: number;
    value: CellValue;
  }) => void;
  onRowGroupExpand?: (props: any) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  rowButtons?: RowButton[];
  rowGrouping?: string[];
  setRowStateMap: React.Dispatch<React.SetStateAction<Map<string | number, any>>>;
  rowsWithSelectedCells: Set<string>;
  selectedColumns: Set<number>;
  setUnexpandedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  tableBodyContainerRef: MutableRefObject<HTMLDivElement | null>;
  theme: Theme;
  unexpandedRows: Set<string>;
  useOddColumnBackground: boolean;
}

export default TableCellProps;
