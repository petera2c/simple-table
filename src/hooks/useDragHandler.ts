import { DragEvent } from "react";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import DragHandlerProps from "../types/DragHandlerProps";
import usePrevious from "./usePrevious";
import { deepClone } from "../utils/generalUtils";
import { useTableContext } from "../context/TableContext";

const REVERT_TO_PREVIOUS_HEADERS_DELAY = 1500;
let prevUpdateTime = Date.now();
let prevDraggingPosition = { screenX: 0, screenY: 0 };

const getHeaderIndexPath = (
  headers: HeaderObject[],
  targetAccessor: Accessor,
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

// Helper function to determine which section a header belongs to based on its pinned property
const getHeaderSection = (header: HeaderObject): "left" | "main" | "right" => {
  if (header.pinned === "left") return "left";
  if (header.pinned === "right") return "right";
  return "main";
};

// Helper function to update header's pinned property based on target section
const updateHeaderPinnedProperty = (
  header: HeaderObject,
  targetSection: "left" | "main" | "right"
): HeaderObject => {
  const updatedHeader = { ...header };
  if (targetSection === "left") {
    updatedHeader.pinned = "left";
  } else if (targetSection === "right") {
    updatedHeader.pinned = "right";
  } else {
    // For main section, remove the pinned property
    delete updatedHeader.pinned;
  }
  return updatedHeader;
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

function insertHeaderAcrossSections(
  headers: HeaderObject[],
  draggedHeader: HeaderObject,
  hoveredHeader: HeaderObject
): { newHeaders: HeaderObject[]; emergencyBreak: boolean } {
  const newHeaders = deepClone(headers);
  let emergencyBreak = false;

  try {
    // Determine which sections the headers belong to
    const hoveredSection = getHeaderSection(hoveredHeader);

    // Find the indices of both headers
    const draggedIndex = newHeaders.findIndex((h) => h.accessor === draggedHeader.accessor);
    const hoveredIndex = newHeaders.findIndex((h) => h.accessor === hoveredHeader.accessor);

    if (draggedIndex === -1 || hoveredIndex === -1) {
      emergencyBreak = true;
      return { newHeaders, emergencyBreak };
    }

    // Remove the dragged header from its current position
    const [removedHeader] = newHeaders.splice(draggedIndex, 1);

    // Update the dragged header's pinned property to match the target section
    const updatedDraggedHeader = updateHeaderPinnedProperty(removedHeader, hoveredSection);

    // Calculate the correct insertion index
    // We want to place the dragged header at the hovered header's original position
    let insertionIndex = hoveredIndex;

    // If dragged was before hovered, the hovered header shifts left after removal
    // But we want to insert at the hovered header's ORIGINAL position
    // So we don't adjust the index - we use the original hoveredIndex
    if (draggedIndex < hoveredIndex) {
      // Keep the original hovered index to place dragged at target's original position
    } else {
      // Dragged was after hovered, hovered position is unchanged after removal
    }

    // Insert the updated dragged header at the target position
    // This places it at the hovered header's position
    newHeaders.splice(insertionIndex, 0, updatedDraggedHeader);
  } catch (error) {
    console.error("Error in insertHeaderAcrossSections:", error);
    emergencyBreak = true;
  }

  return { newHeaders, emergencyBreak };
}

const useDragHandler = ({
  draggedHeaderRef,
  headers,
  hoveredHeaderRef,
  onColumnOrderChange,
  onTableHeaderDragEnd,
}: DragHandlerProps) => {
  const { setHeaders } = useTableContext();
  const prevHeaders = usePrevious<HeaderObject[] | null>(headers);

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
    if (!headers || !draggedHeaderRef.current) return;

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

    const draggedHeader = draggedHeaderRef.current;

    // Check if this is a cross-section drag
    const draggedSection = getHeaderSection(draggedHeader);
    const hoveredSection = getHeaderSection(hoveredHeader);
    const isCrossSectionDrag = draggedSection !== hoveredSection;

    let newHeaders: HeaderObject[];
    let emergencyBreak = false;

    if (isCrossSectionDrag) {
      // Handle cross-section dragging with insertion
      const result = insertHeaderAcrossSections(headers, draggedHeader, hoveredHeader);
      newHeaders = result.newHeaders;
      emergencyBreak = result.emergencyBreak;
    } else {
      // Handle same-section dragging (existing logic)
      const currentHeaders = headers;

      // Get the index paths of both headers
      const draggedHeaderIndexPath = getHeaderIndexPath(currentHeaders, draggedHeader.accessor);
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

      // Check if both headers share the same parent (for nested headers)
      // Headers share the same parent if all path indices match except the last one
      const haveSameParent = (path1: number[], path2: number[]): boolean => {
        if (path1.length !== path2.length) return false;
        if (path1.length === 1) return true; // Top-level headers always share the same parent (root)
        // Compare all indices except the last one (which is the position within the parent)
        return path1.slice(0, -1).every((index, i) => index === path2[i]);
      };

      // If the headers don't share the same parent, don't allow the drag
      if (!haveSameParent(draggedHeaderIndexPath, targetHoveredIndexPath)) {
        return;
      }

      // Create a copy of the headers
      const result = swapHeaders(currentHeaders, draggedHeaderIndexPath, targetHoveredIndexPath);
      newHeaders = result.newHeaders;
      emergencyBreak = result.emergencyBreak;
    }

    if (
      // If the header is animating, don't allow the drag
      isAnimating ||
      // If the header is the same as the dragged header, don't allow the drag
      hoveredHeader.accessor === draggedHeader.accessor ||
      // If the distance is less than 10, don't allow the drag
      distance < 10 ||
      // If the new headers are the same as the previous headers, don't allow the drag
      JSON.stringify(newHeaders) === JSON.stringify(headers) ||
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
    // Clear the refs first to remove dragging state
    draggedHeaderRef.current = null;
    hoveredHeaderRef.current = null;

    // Use setHeaders to trigger a re-render and properly clear the st-dragging class
    setTimeout(() => {
      setHeaders((prevHeaders) => [...prevHeaders]);
      // Call the column order change callback
      onColumnOrderChange?.(headers);
    }, 10);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

export default useDragHandler;
