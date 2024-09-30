import { useRef, useState } from "react";
import HeaderObject from "../types/HeaderObject";

interface UseTableHeaderCellProps {
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  onDragEnd: (newHeaders: HeaderObject[]) => void;
}
var isUpdating = false;

const useTableHeaderCell = ({
  draggedHeaderRef,
  headersRef,
  hoveredHeaderRef,
  onDragEnd,
}: UseTableHeaderCellProps) => {
  const handleDragStart = (header: HeaderObject) => {
    draggedHeaderRef.current = header;
  };

  const handleDragOver = (
    hoveredHeader: HeaderObject,
    event: React.DragEvent
  ) => {
    if (isUpdating) return;
    hoveredHeaderRef.current = hoveredHeader;

    console.log("\n");
    console.log(new Date().toISOString());
    console.log("draggedHeader", draggedHeaderRef.current);
    console.log("hoveredHeader", hoveredHeaderRef.current);
    if (
      hoveredHeader.accessor !== draggedHeaderRef.current?.accessor &&
      draggedHeaderRef.current !== null &&
      !isUpdating
    ) {
      isUpdating = true;
      const newHeaders = [...(headersRef.current || [])];
      const draggedHeaderIndex = headersRef.current?.findIndex(
        (header) => header.accessor === draggedHeaderRef.current?.accessor
      );
      const hoveredHeaderIndex = headersRef.current?.findIndex(
        (header) => header.accessor === hoveredHeader.accessor
      );
      if (draggedHeaderIndex === undefined || hoveredHeaderIndex === undefined)
        return;

      const [draggedHeader] = newHeaders.splice(draggedHeaderIndex, 1);
      newHeaders.splice(hoveredHeaderIndex, 0, draggedHeader);
      console.log(headersRef.current);

      // Check if the newHeaders array is different from the original headers array
      // if (JSON.stringify(newHeaders) !== JSON.stringify(headers))
      // console.log("newHeaders", newHeaders);
      setTimeout(() => {
        console.log("newHeaders", newHeaders);
        onDragEnd(newHeaders);

        setTimeout(() => {
          isUpdating = false;
        }, 500);
      }, 50);
    }
  };

  const handleDrop = (header: HeaderObject) => {
    if (draggedHeaderRef.current === null) return;

    const newHeaders = [...(headersRef.current || [])];

    const draggedHeaderIndex = headersRef.current?.findIndex(
      (header) => header.accessor === draggedHeaderRef.current?.accessor
    );
    const hoveredHeaderIndex = headersRef.current?.findIndex(
      (header) => header.accessor === header.accessor
    );
    if (draggedHeaderIndex === undefined || hoveredHeaderIndex === undefined)
      return;
    const [draggedHeader] = newHeaders.splice(draggedHeaderIndex, 1);
    newHeaders.splice(hoveredHeaderIndex, 0, draggedHeader);

    draggedHeaderRef.current = null;
    hoveredHeaderRef.current = null;
    onDragEnd(newHeaders);
  };

  const handleDragEnd = () => {
    draggedHeaderRef.current = null;
    hoveredHeaderRef.current = null;
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
};

export default useTableHeaderCell;
