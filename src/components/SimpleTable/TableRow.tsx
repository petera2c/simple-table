import { RowId } from "../../types/RowId";
import VisibleRow from "../../types/VisibleRow";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import RenderCells from "./RenderCells";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import { ColumnIndices } from "./TableBody";

// Define just the props needed for RenderCells
interface TableRowProps {
  columnIndices: ColumnIndices;
  getNextRowIndex: () => number;
  gridTemplateColumns: string;
  index: number;
  pinned?: Pinned;
  rowHeight: number;
  visibleRow: VisibleRow;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isWidthDragging: boolean;
  onExpandRowClick: (rowId: RowId) => void;
}

const TableRow = ({
  columnIndices,
  getNextRowIndex,
  gridTemplateColumns,
  headers,
  hiddenColumns,
  index,
  isWidthDragging,
  onExpandRowClick,
  pinned,
  rowHeight,
  visibleRow,
}: TableRowProps) => {
  const { position } = visibleRow;
  const rowIndex = getNextRowIndex(); // Get the next available index

  return (
    <div
      className="st-table-row"
      style={{
        gridTemplateColumns,
        top: calculateRowTopPosition({ position, rowHeight }),
        height: `${rowHeight}px`,
      }}
    >
      <RenderCells
        columnIndices={columnIndices}
        headers={headers}
        hiddenColumns={hiddenColumns}
        isWidthDragging={isWidthDragging}
        key={index}
        onExpandRowClick={onExpandRowClick}
        pinned={pinned}
        rowIndex={rowIndex}
        visibleRow={visibleRow}
      />
    </div>
  );
};

export default TableRow;
