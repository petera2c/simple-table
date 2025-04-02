import { RowId } from "../../types/RowId";
import TableBodyProps from "../../types/TableBodyProps";
import VisibleRow from "../../types/VisibleRow";
import RenderCells from "./RenderCells";

const TableRow = ({
  depth = 0,
  getNextRowIndex,
  gridTemplateColumns,
  index,
  lastGroupRow,
  pinned,
  props,
  rowHeight,
  visibleRow,
}: {
  depth?: number;
  getNextRowIndex: () => number;
  gridTemplateColumns: string;
  index: number;
  lastGroupRow?: boolean;
  pinned?: "left" | "right";
  props: Omit<TableBodyProps, "currentRows" | "headerContainerRef"> & {
    onExpandRowClick: (rowId: RowId) => void;
  };
  rowHeight: number;
  visibleRow: VisibleRow;
}) => {
  const { row, position } = visibleRow;
  const rowIndex = getNextRowIndex(); // Get the next available index

  return (
    <div
      className="st-table-row"
      style={{
        gridTemplateColumns,
        top: `${position * rowHeight}px`,
        height: `${rowHeight}px`,
      }}
    >
      <RenderCells
        {...props}
        depth={depth}
        lastGroupRow={lastGroupRow}
        key={index}
        pinned={pinned}
        row={row}
        rowIndex={rowIndex}
      />
    </div>
  );
};

export default TableRow;
