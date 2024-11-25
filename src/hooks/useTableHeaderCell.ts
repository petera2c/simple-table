import { DragEvent, useRef } from "react";
import HeaderObject from "../types/HeaderObject";
import UseTableHeaderCellProps from "../types/UseTableHeaderCellProps";

const useTableHeaderCell = ({
  draggedHeaderRef,
  headersRef,
  hoveredHeaderRef,
  onTableHeaderDragEnd,
}: UseTableHeaderCellProps) => {
  const prevDraggingPosition = useRef({ screenX: 0, screenY: 0 });

  const handleDragStart = (header: HeaderObject) => {
    draggedHeaderRef.current = header;
  };

  const updateHeaders = (hoveredHeader: HeaderObject) => {
    hoveredHeaderRef.current = hoveredHeader;

    if (!headersRef.current) return;

    const newHeaders = [...headersRef.current];
    const draggedHeaderIndex = newHeaders.findIndex(
      (header) => header.accessor === draggedHeaderRef.current?.accessor
    );
    const hoveredHeaderIndex = newHeaders.findIndex(
      (header) => header.accessor === hoveredHeader.accessor
    );

    if (draggedHeaderIndex === undefined || hoveredHeaderIndex === undefined)
      return;

    const [draggedHeader] = newHeaders.splice(draggedHeaderIndex, 1);
    newHeaders.splice(hoveredHeaderIndex, 0, draggedHeader);

    if (JSON.stringify(newHeaders) !== JSON.stringify(headersRef.current)) {
      onTableHeaderDragEnd(newHeaders);
    }
  };

  const handleDragOver = ({
    event,
    hoveredHeader,
  }: {
    event: DragEvent<HTMLDivElement>;
    hoveredHeader: HeaderObject;
  }) => {
    const animations = event.currentTarget.getAnimations();
    const isAnimating = animations.some(
      (animation) => animation.playState === "running"
    );

    if (isAnimating) {
      return;
    }

    // Prevent click event from firing
    event.preventDefault();
    // This helps prevent the drag ghost from being shown
    event.dataTransfer.dropEffect = "move";

    if (
      hoveredHeader.accessor === draggedHeaderRef.current?.accessor ||
      draggedHeaderRef.current === null
    ) {
      return;
    }

    const { screenX, screenY } = event;
    const distance = Math.sqrt(
      Math.pow(screenX - prevDraggingPosition.current.screenX, 2) +
        Math.pow(screenY - prevDraggingPosition.current.screenY, 2)
    );
    if (distance < 10) {
      return;
    }
    prevDraggingPosition.current = { screenX, screenY };

    updateHeaders(hoveredHeader);
  };

  const handleDragEnd = () => {
    draggedHeaderRef.current = null;
    hoveredHeaderRef.current = null;
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

export default useTableHeaderCell;
