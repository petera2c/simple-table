import TableBodyProps from "../../types/TableBodyProps";
import VisibleRow from "../../types/VisibleRow";
import RenderCells from "./RenderCells";

const TableRow = ({
  depth = 0,
  getNextRowIndex,
  index,
  lastGroupRow,
  pinned,
  props,
  rowHeight,
  visibleRow,
}: {
  depth?: number;
  getNextRowIndex: () => number;
  index: number;
  lastGroupRow?: boolean;
  pinned?: "left" | "right";
  props: Omit<TableBodyProps, "currentRows" | "headerContainerRef"> & {
    onExpandRowClick: (rowIndex: number) => void;
  };
  rowHeight: number;
  visibleRow: VisibleRow;
}) => {
  const { row, position } = visibleRow;
  const rowIndex = getNextRowIndex(); // Get the next available index

  const gridTemplateColumns = props.headers
    .filter((header) => pinned === header.pinned)
    .map((header) => `${header.width}px`)
    .join(" ");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns,
        position: "absolute",
        top: `${position * rowHeight}px`,
        height: `${rowHeight}px`,
        transform: "translateZ(0)",
        transition: "background 0.2s ease",
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
