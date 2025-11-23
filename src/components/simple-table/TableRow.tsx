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
  index: number;
  pinned?: Pinned;
  rowHeight: number;
  rowIndices: RowIndices;
  setHoveredIndex: (index: number | null) => void;
  tableRow: TableRowType;
}

const TableRow = ({
  columnIndices,
  columnIndexStart,
  gridTemplateColumns,
  headers,
  index,
  pinned,
  rowHeight,
  rowIndices,
  setHoveredIndex,
  tableRow,
}: TableRowProps) => {
  const {
    useHoverRowBackground,
    rowIdAccessor,
    isAnimating,
    isRowSelected,
    useOddEvenRowBackground,
  } = useTableContext();
  const { position, displayPosition } = tableRow;
  // Get row index from rowIndices using the row's ID

  const isOdd = position % 2 === 0;

  // Get stable row ID for key
  const rowId = getRowId({ row: tableRow.row, rowIdAccessor });

  // Check if this row is selected
  const isSelected = isRowSelected ? isRowSelected(String(rowId)) : false;

  return (
    <div
      className={`st-row ${useOddEvenRowBackground ? (isOdd ? "even" : "odd") : ""} ${
        isSelected ? "selected" : ""
      }`}
      data-index={index}
      onMouseEnter={() => {
        // Don't apply hover effects during animations
        if (!isAnimating && useHoverRowBackground) {
          setHoveredIndex(index);
        }
      }}
      style={{
        gridTemplateColumns,
        transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight })}px, 0)`,
        height: `${rowHeight}px`,
      }}
    >
      <RenderCells
        columnIndexStart={columnIndexStart}
        columnIndices={columnIndices}
        displayRowNumber={displayPosition}
        headers={headers}
        key={rowId}
        pinned={pinned}
        rowIndex={position}
        rowIndices={rowIndices}
        tableRow={tableRow}
      />
    </div>
  );
};

export default TableRow;
