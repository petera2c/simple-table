import type TableRowType from "../../types/TableRow";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import RenderCells from "./RenderCells";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { useTableContext } from "../../context/TableContext";
import { getRowId } from "../../utils/rowUtils";

// Define just the props needed for RenderCells
interface TableRowProps {
  columnIndexStart?: number;
  columnIndices: ColumnIndices;
  gridTemplateColumns: string;
  headers: HeaderObject[];
  hoveredIndex: number | null;
  index: number;
  pinned?: Pinned;
  rowHeight: number;
  rowIndices: RowIndices;
  setHoveredIndex: (index: number | null) => void;
  visibleRow: TableRowType;
}

const TableRow = ({
  columnIndices,
  columnIndexStart,
  gridTemplateColumns,
  headers,
  hoveredIndex,
  index,
  pinned,
  rowHeight,
  rowIndices,
  setHoveredIndex,
  visibleRow,
}: TableRowProps) => {
  const { useHoverRowBackground, rowIdAccessor } = useTableContext();
  const { position, previousPosition } = visibleRow;
  // Get row index from rowIndices using the row's ID

  const isOdd = position % 2 === 0;

  // Get stable row ID for key
  const rowId = getRowId(visibleRow.row, visibleRow.position, rowIdAccessor);

  // Log position changes for debugging
  if (position !== previousPosition) {
    console.log(
      `🎬 TableRow: Row position changed`,
      JSON.stringify({
        rowId: String(rowId),
        from: previousPosition,
        to: position,
        pinned: pinned || "main",
      })
    );
  }

  return (
    <div
      className={`st-row ${isOdd ? "even" : "odd"} ${
        hoveredIndex === index && useHoverRowBackground ? "hovered" : ""
      }`}
      onMouseEnter={() => {
        setHoveredIndex(index);
      }}
      style={{
        gridTemplateColumns,
        top: calculateRowTopPosition({ position, rowHeight }),
        height: `${rowHeight}px`,
      }}
    >
      <RenderCells
        columnIndexStart={columnIndexStart}
        columnIndices={columnIndices}
        headers={headers}
        key={rowId}
        pinned={pinned}
        rowIndex={position}
        rowIndices={rowIndices}
        visibleRow={visibleRow}
      />
    </div>
  );
};

export default TableRow;
