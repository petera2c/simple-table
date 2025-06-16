import { DragEvent } from "react";
import HeaderObject from "../types/HeaderObject";
import DragHandlerProps from "../types/DragHandlerProps";
import usePrevious from "./usePrevious";
import { deepClone } from "../utils/generalUtils";

const REVERT_TO_PREVIOUS_HEADERS_DELAY = 1500;
let prevUpdateTime = Date.now();
let prevDraggingPosition = { screenX: 0, screenY: 0 };

const getHeaderIndexPath = (
  headers: HeaderObject[],
  targetAccessor: string,
  currentPath: number[] = []
): number[] | null => {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (header.accessor === targetAccessor) {
      return [...currentPath, i];
    }
    if (header.children && header.children.length > 0) {
      const path = getHeaderIndexPath(header.children, targetAccessor, [...currentPath, i]);
      if (path) return path;
    }
  }
  return null;
};

function swapHeaders(
  headers: HeaderObject[],
  draggedPath: number[],
  hoveredPath: number[]
): { newHeaders: HeaderObject[]; emergencyBreak: boolean } {
  // Create a deep copy of headers using our custom deep clone function
  const newHeaders = deepClone(headers);
  let emergencyBreak = false;

  // Helper function to get a header at a given path
  function getHeaderAtPath(headers: HeaderObject[], path: number[]): HeaderObject {
    let current = headers;
    let header: HeaderObject | undefined;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].children!;
    }
    header = current[path[path.length - 1]];
    return header;
  }

  // Helper function to set a header at a given path
  function setHeaderAtPath(headers: HeaderObject[], path: number[], value: HeaderObject): void {
    let current = headers;
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]].children) {
        current = current[path[i]].children!;
      } else {
        // If the header is not a child, we need to break out of the loop
        // This is an emergency because it meant that the header order has changed while this function was running
        emergencyBreak = true;
        break;
      }
    }
    current[path[path.length - 1]] = value;
  }

  // Get the headers at the dragged and hovered paths
  const draggedHeader = getHeaderAtPath(newHeaders, draggedPath);
  const hoveredHeader = getHeaderAtPath(newHeaders, hoveredPath);

  // Swap the headers
  setHeaderAtPath(newHeaders, draggedPath, hoveredHeader);
  setHeaderAtPath(newHeaders, hoveredPath, draggedHeader);

  return { newHeaders, emergencyBreak };
}

const useDragHandler = ({
  draggedHeaderRef,
  headersRef,
  hoveredHeaderRef,
  onColumnOrderChange,
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
    const isAnimating = animations.some((animation) => animation.playState === "running");

    // Get the distance between the previous dragging position and the current position
    const { screenX, screenY } = event;
    const distance = Math.sqrt(
      Math.pow(screenX - prevDraggingPosition.screenX, 2) +
        Math.pow(screenY - prevDraggingPosition.screenY, 2)
    );

    hoveredHeaderRef.current = hoveredHeader;

    // Function to get the index path to a header

    const currentHeaders = headersRef.current;

    // Get the index paths of both headers
    const draggedHeaderIndexPath = getHeaderIndexPath(
      currentHeaders,
      draggedHeaderRef.current?.accessor || ""
    );
    const hoveredHeaderIndexPath = getHeaderIndexPath(currentHeaders, hoveredHeader.accessor);

    if (!draggedHeaderIndexPath || !hoveredHeaderIndexPath) return;

    const draggedHeaderDepth = draggedHeaderIndexPath.length;
    const hoveredHeaderDepth = hoveredHeaderIndexPath.length;

    let targetHoveredIndexPath = hoveredHeaderIndexPath;

    if (draggedHeaderDepth !== hoveredHeaderDepth) {
      const depthDifference = hoveredHeaderDepth - draggedHeaderDepth;
      if (depthDifference > 0) {
        // Go up the hierarchy to find the parent at the same depth as the dragged header
        targetHoveredIndexPath = hoveredHeaderIndexPath.slice(0, -depthDifference);
      }
    }
    console.log("targetHoveredIndexPath", targetHoveredIndexPath);

    // Create a copy of the headers
    const { newHeaders, emergencyBreak } = swapHeaders(
      currentHeaders,
      draggedHeaderIndexPath,
      targetHoveredIndexPath
    );

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
      draggedHeaderIndexPath.length === 0 ||
      targetHoveredIndexPath.length === 0 ||
      // If the new headers are the same as the previous headers, don't allow the drag
      JSON.stringify(newHeaders) === JSON.stringify(headersRef.current) ||
      emergencyBreak
    )
      return;

    // Delay reverting headers to prevent quick reversion when dragging over wide columns.
    const now = Date.now();
    const arePreviousHeadersAndNewHeadersTheSame =
      JSON.stringify(newHeaders) === JSON.stringify(prevHeaders);
    const shouldRevertToPreviousHeaders = now - prevUpdateTime < REVERT_TO_PREVIOUS_HEADERS_DELAY;

    if (
      arePreviousHeadersAndNewHeadersTheSame &&
      (shouldRevertToPreviousHeaders || distance < 40)
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
    onColumnOrderChange?.(headersRef.current);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

export default useDragHandler;
