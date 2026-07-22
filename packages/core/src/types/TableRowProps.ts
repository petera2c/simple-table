import CellChangeProps from "./CellChangeProps";
import ColumnDef from "./ColumnDef";
import Row from "./Row";
import Cell from "./Cell";

type TableRowProps = {
  currentRows: Row[];
  draggedHeaderRef: { current: ColumnDef | null };
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (props: Cell) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  headers: ColumnDef[];
  hoveredHeaderRef: { current: ColumnDef | null };
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isInitialFocusedCell: (rowIndex: number, columnIndex: number) => boolean;
  onCellEdit?: (props: CellChangeProps) => void;
  onTableHeaderDragEnd: (newHeaders: ColumnDef[]) => void;
  onToggleGroup: (rowId: number) => void;
  row: Row;
  rowIndex: number;
  enablePagination: boolean;
  tableRef: { current: HTMLDivElement | null };
};

export default TableRowProps;
