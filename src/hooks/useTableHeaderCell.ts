import { useState } from "react";

interface UseTableHeaderCellProps {
  draggedIndex: number | null;
  headers: string[];
  onDragEnd: (newHeaders: string[]) => void;
  setDraggedIndex: (index: number | null) => void;
  setHoveredIndex: (index: number | null) => void;
}

const useTableHeaderCell = ({
  draggedIndex,
  headers,
  onDragEnd,
  setDraggedIndex,
  setHoveredIndex,
}: UseTableHeaderCellProps) => {
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

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
};

export default useTableHeaderCell;
