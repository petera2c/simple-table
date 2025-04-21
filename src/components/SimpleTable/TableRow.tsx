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
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  index: number;
  isWidthDragging: boolean;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowHeight: number;
  rowIndices: RowIndices;
  visibleRow: VisibleRow;
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

  const isOdd = position % 2 === 0;

  return (
    <div
      className={`st-row ${isOdd ? "even" : "odd"}`}
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
        rowIndex={index}
        rowIndices={rowIndices}
        visibleRow={visibleRow}
      />
    </div>
  );
};

export default TableRow;
