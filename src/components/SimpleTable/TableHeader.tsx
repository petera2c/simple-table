import React, { useState } from "react";

interface TableHeaderProps {
  headers: string[];
  onSort: (columnIndex: number) => void;
  onDragEnd: (newHeaders: string[]) => void;
}

const TableHeader = ({ headers, onSort, onDragEnd }: TableHeaderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number, event: React.DragEvent) => {
    event.preventDefault();
    setHoveredIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;

    const newHeaders = [...headers];
    const [draggedHeader] = newHeaders.splice(draggedIndex, 1);
    newHeaders.splice(index, 0, draggedHeader);

    setDraggedIndex(null);
    setHoveredIndex(null);
    onDragEnd(newHeaders);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoveredIndex(null);
  };

  return (
    <thead className="table-header">
      <tr>
        {headers.map((header, index) => (
          <th
            className={`table-header-cell ${
              index === hoveredIndex ? "hovered" : ""
            }`}
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(index, event)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            onClick={() => onSort(index)}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
