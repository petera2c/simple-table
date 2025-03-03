import { DragEvent } from "react";
import HeaderObject from "../types/HeaderObject";
import DragHandlerProps from "../types/DragHandlerProps";
import usePrevious from "./usePrevious";

const REVERT_TO_PREVIOUS_HEADERS_DELAY = 800;
let prevUpdateTime = Date.now();
let prevDraggingPosition = { screenX: 0, screenY: 0 };

const useDragHandler = ({
  draggedHeaderRef,
  headersRef,
  hoveredHeaderRef,
  onTableHeaderDragEnd,
}: DragHandlerProps) => {
  const prevHeaders = usePrevious<HeaderObject[] | null>(headersRef.current);

  const handleDragStart = (header: HeaderObject) => {
    draggedHeaderRef.current = header;
    prevUpdateTime = Date.now();
  };

  const handleDragOver = ({
    event,
    hoveredHeader,
  }: {
    event: DragEvent<HTMLDivElement>;
    hoveredHeader: HeaderObject;
  }) => {
    // Prevent click event from firing
    event.preventDefault();

    // If the headers are not set, don't allow the drag
    if (!headersRef.current) return;

    // Get the animations on the header
    const animations = event.currentTarget.getAnimations();
    const isAnimating = animations.some(
      (animation) => animation.playState === "running"
    );

    // Get the distance between the previous dragging position and the current position
    const { screenX, screenY } = event;
    const distance = Math.sqrt(
      Math.pow(screenX - prevDraggingPosition.screenX, 2) +
        Math.pow(screenY - prevDraggingPosition.screenY, 2)
    );

    hoveredHeaderRef.current = hoveredHeader;

    // Create a copy of the headers
    const newHeaders = [...headersRef.current];
    // Get the indexes of the dragged and hovered headers
    const draggedHeaderIndex = newHeaders.findIndex(
      (header) => header.accessor === draggedHeaderRef.current?.accessor
    );
    const hoveredHeaderIndex = newHeaders.findIndex(
      (header) => header.accessor === hoveredHeader.accessor
    );

    // Remove the dragged header from its current position and insert it at the hovered header's position
    const [draggedHeader] = newHeaders.splice(draggedHeaderIndex, 1);
    newHeaders.splice(hoveredHeaderIndex, 0, draggedHeader);

    if (
      // If the header is animating, don't allow the drag
      isAnimating ||
      // If the header is the same as the dragged header, don't allow the drag
      hoveredHeader.accessor === draggedHeaderRef.current?.accessor ||
      // If the dragged header is null, don't allow the drag
      draggedHeaderRef.current === null ||
      // If the distance is less than 10, don't allow the drag
      distance < 10 ||
      // If the dragged header index or hovered header index is undefined, don't allow the drag
      draggedHeaderIndex === undefined ||
      hoveredHeaderIndex === undefined ||
      // If the new headers are the same as the previous headers, don't allow the drag
      JSON.stringify(newHeaders) === JSON.stringify(headersRef.current)
    )
      return;

    // Delay reverting headers to prevent quick reversion when dragging over wide columns.
    const now = Date.now();
    const arePreviousHeadersAndNewHeadersTheSame =
      JSON.stringify(newHeaders) === JSON.stringify(prevHeaders);
    const shouldRevertToPreviousHeaders =
      now - prevUpdateTime < REVERT_TO_PREVIOUS_HEADERS_DELAY;

    if (
      arePreviousHeadersAndNewHeadersTheSame &&
      shouldRevertToPreviousHeaders &&
      // If the user is moving the header quickly they will have a larger distance and we should allow the drag
      distance < 50
    ) {
      return;
    }

    // Update the previous update time
    prevUpdateTime = now;

    // Update the previous dragging position
    prevDraggingPosition = { screenX, screenY };

    // Call the onTableHeaderDragEnd callback with the new headers
    onTableHeaderDragEnd(newHeaders);
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

export default useDragHandler;
