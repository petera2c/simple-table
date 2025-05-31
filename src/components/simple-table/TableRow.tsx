import { RowId } from "../../types/RowId";
import VisibleRow from "../../types/VisibleRow";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import RenderCells from "./RenderCells";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { useTableContext } from "../../context/TableContext";

// Define just the props needed for RenderCells
interface TableRowProps {
  columnIndexStart?: number;
  columnIndices: ColumnIndices;
  gridTemplateColumns: string;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  hoveredIndex: number | null;
  index: number;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowHeight: number;
  rowIndices: RowIndices;
  setHoveredIndex: (index: number | null) => void;
  visibleRow: VisibleRow;
}

const TableRow = ({
  columnIndices,
  columnIndexStart,
  gridTemplateColumns,
  headers,
  hiddenColumns,
  hoveredIndex,
  index,
  onExpandRowClick,
  pinned,
  rowHeight,
  rowIndices,
  setHoveredIndex,
  visibleRow,
}: TableRowProps) => {
  const { useHoverRowBackground } = useTableContext();
  const { position } = visibleRow;
  // Get row index from rowIndices using the row's ID

  const isOdd = position % 2 === 0;

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
        hiddenColumns={hiddenColumns}
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
