import { DragEvent, useRef } from "react";
import useThrottledHandleDragover from "./useThrottledHandleDragover";
import UseTableHeaderCellProps from "../types/UseTableHeaderCellProps";
import HeaderObject from "../types/HeaderObject";

type OnDragOverProps = {
  event: DragEvent<HTMLDivElement>;
  header: HeaderObject;
};

export const useOnDragOver = ({
  draggedHeaderRef,
  headersRef,
  hoveredHeaderRef,
  onTableHeaderDragEnd,
}: UseTableHeaderCellProps) => {
  const { throttledHandleDragOver } = useThrottledHandleDragover({
    draggedHeaderRef,
    headersRef,
    hoveredHeaderRef,
    onTableHeaderDragEnd,
  });

  // Refs
  const prevDraggingPosition = useRef({ pageX: 0, pageY: 0 });

  const onDragOver = ({ event, header }: OnDragOverProps) => {
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

    const { pageX, pageY } = event;
    const distance = Math.sqrt(
      Math.pow(pageX - prevDraggingPosition.current.pageX, 2) +
        Math.pow(pageY - prevDraggingPosition.current.pageY, 2)
    );

    if (distance < 5) {
      return;
    }
    prevDraggingPosition.current = { pageX, pageY };
    throttledHandleDragOver(header, event);
  };

  return { onDragOver, prevDraggingPosition };
};
