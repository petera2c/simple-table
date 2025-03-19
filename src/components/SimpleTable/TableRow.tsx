import Row from "../../types/Row";
import TableBodyProps from "../../types/TableBodyProps";
import RenderCells from "./RenderCells";

const TableRow = ({
  getNextRowIndex,
  index,
  pinned,
  props,
  row,
}: {
  getNextRowIndex: () => number;
  index: number;
  pinned?: "left" | "right";
  props: Omit<TableBodyProps, "currentRows"> & {
    onExpandRowClick: (rowIndex: number) => void;
  };
  row: Row;
}) => {
  const isGroup = (row.rowMeta?.children?.length || 0) > 0;
  const rowIndex = getNextRowIndex(); // Get the next available index

  return (
    <>
      <RenderCells
        {...props}
        key={index}
        pinned={pinned}
        row={row}
        rowIndex={rowIndex}
      />
      {isGroup &&
        props.isRowExpanded(row.rowMeta.rowId) &&
        row.rowMeta.children?.map((child, childIndex) => (
          <TableRow
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
