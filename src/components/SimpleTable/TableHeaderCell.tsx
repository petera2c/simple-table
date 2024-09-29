import { forwardRef, LegacyRef } from "react";
import useTableHeaderCell from "../../hooks/useTableHeaderCell";

interface TableHeaderCellProps {
  draggedIndex: number | null;
  headers: string[];
  hoveredIndex: number | null;
  index: number;
  onDragEnd: (newHeaders: string[]) => void;
  onSort: (columnIndex: number) => void;
  setDraggedIndex: (index: number | null) => void;
  setHoveredIndex: (index: number | null) => void;
}

const TableHeaderCell = forwardRef(
  (
    {
      draggedIndex,
      headers,
      hoveredIndex,
      index,
      onDragEnd,
      onSort,
      setDraggedIndex,
      setHoveredIndex,
    }: TableHeaderCellProps,
    ref: LegacyRef<HTMLTableCellElement>
  ) => {
    const header = headers[index];
    const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
      useTableHeaderCell({
        draggedIndex,
        headers,
        onDragEnd,
        setDraggedIndex,
        setHoveredIndex,
      });

    return (
      <th
        className={`table-header-cell ${
          index === hoveredIndex ? "hovered" : ""
        }`}
        key={header}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(event) => handleDragOver(index, event)}
        onDrop={() => handleDrop(index)}
        onDragEnd={handleDragEnd}
        onClick={() => onSort(index)}
        ref={ref}
      >
        {header}
      </th>
    );
  }
);

export default TableHeaderCell;
