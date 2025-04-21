import { RowId } from "../../types/RowId";
import VisibleRow from "../../types/VisibleRow";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import RenderCells from "./RenderCells";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";

// Define just the props needed for RenderCells
interface TableRowProps {
  columnIndices: ColumnIndices;
  gridTemplateColumns: string;
  index: number;
  pinned?: Pinned;
  rowHeight: number;
  rowIndices: RowIndices;
  visibleRow: VisibleRow;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isWidthDragging: boolean;
  onExpandRowClick: (rowId: RowId) => void;
}

const TableRow = ({
  columnIndices,
  gridTemplateColumns,
  headers,
  hiddenColumns,
  index,
  isWidthDragging,
  onExpandRowClick,
  pinned,
  rowHeight,
  rowIndices,
  visibleRow,
}: TableRowProps) => {
  const { position } = visibleRow;
  // Get row index from rowIndices using the row's ID
  const rowIndex = index; // Use the provided index by default

  return (
    <div
      className={`st-row ${rowIndex % 2 === 0 ? "even" : "odd"}`}
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
        rowIndices={rowIndices}
        visibleRow={visibleRow}
      />
    </div>
  );
};

export default TableRow;
