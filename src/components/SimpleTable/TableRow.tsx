import Row from "../../types/Row";
import TableBodyProps from "../../types/TableBodyProps";
import RenderCells from "./RenderCells";

const TableRow = ({
  depth = 0,
  getNextRowIndex,
  index,
  lastGroupRow,
  pinned,
  props,
  row,
}: {
  depth?: number;
  getNextRowIndex: () => number;
  index: number;
  lastGroupRow?: boolean;
  pinned?: "left" | "right";
  props: Omit<TableBodyProps, "currentRows"> & {
    onExpandRowClick: (rowIndex: number) => void;
  };
  row: Row;
}) => {
  const isGroup = (row.rowMeta?.children?.length || 0) > 0;
  const rowIndex = getNextRowIndex(); // Get the next available index

  const children = row.rowMeta?.children || [];

  return (
    <>
      <RenderCells
        {...props}
        depth={depth}
        lastGroupRow={lastGroupRow}
        key={index}
        pinned={pinned}
        row={row}
        rowIndex={rowIndex}
      />
      {isGroup &&
        props.isRowExpanded(row.rowMeta.rowId) &&
        children.map((child, childIndex) => (
          <TableRow
            depth={depth + 1}
            getNextRowIndex={getNextRowIndex}
            index={childIndex}
            key={childIndex}
            pinned={pinned}
            props={props}
            row={child}
          />
        ))}
    </>
  );
};

export default TableRow;
