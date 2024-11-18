import { DragEvent, useRef } from "react";
import HeaderObject from "../types/HeaderObject";
import OnDragOverProps from "../types/OnDragOverProps";

export const useDragOver = () => {
  // Refs
  const prevDraggingPosition = useRef({ pageX: 0, pageY: 0 });

  const onDragOver = ({
    event,
    header,
    throttledHandleDragOver,
  }: OnDragOverProps) => {
    // Prevent click event from firing
    event.preventDefault();
    // This helps prevent the drag ghost from being shown
    event.dataTransfer.dropEffect = "move";

    const { pageX, pageY } = event;
    if (
      pageX === prevDraggingPosition.current.pageX &&
      pageY === prevDraggingPosition.current.pageY
    ) {
      return;
    }
    prevDraggingPosition.current = { pageX, pageY };
    throttledHandleDragOver(header, event);
  };

  return { onDragOver, prevDraggingPosition };
};
