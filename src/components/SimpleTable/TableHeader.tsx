import { createRef, useState } from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";

interface TableHeaderProps {
  headers: string[];
  onSort: (columnIndex: number) => void;
  onDragEnd: (newHeaders: string[]) => void;
}

const TableHeader = ({ headers, onSort, onDragEnd }: TableHeaderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <thead className="table-header">
      <tr>
        <Animate>
          {headers.map((header, index) => (
            <TableHeaderCell
              draggedIndex={draggedIndex}
              headers={headers}
              hoveredIndex={hoveredIndex}
              index={index}
              key={header}
              onDragEnd={onDragEnd}
              onSort={onSort}
              ref={createRef()}
              setDraggedIndex={setDraggedIndex}
              setHoveredIndex={setHoveredIndex}
            />
          ))}
        </Animate>
      </tr>
    </thead>
  );
};

export default TableHeader;
