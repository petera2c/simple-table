import { RowId } from "../../types/RowId";
import TableBodyProps from "../../types/TableBodyProps";
import VisibleRow from "../../types/VisibleRow";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import RenderCells from "./RenderCells";
import { Pinned } from "../../types/Pinned";

const TableRow = ({
  getNextRowIndex,
  gridTemplateColumns,
  index,
  pinned,
  props,
  rowHeight,
  visibleRow,
}: {
  getNextRowIndex: () => number;
  gridTemplateColumns: string;
  index: number;
  pinned?: Pinned;
  props: Omit<TableBodyProps, "currentRows" | "headerContainerRef"> & {
    onExpandRowClick: (rowId: RowId) => void;
  };
  rowHeight: number;
  visibleRow: VisibleRow;
}) => {
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
        key={index}
        pinned={pinned}
        rowIndex={rowIndex}
        visibleRow={visibleRow}
        {...props}
      />
    </div>
  );
};

export default TableRow;
