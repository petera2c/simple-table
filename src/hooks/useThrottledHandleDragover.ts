import { useRef } from "react";
import HeaderObject from "../types/HeaderObject";
import { throttle } from "../utils/performanceUtils";
import useTableHeaderCell from "./useTableHeaderCell";
import UseTableHeaderCellProps from "../types/UseTableHeaderCellProps";

const useThrottledHandleDragover = ({
  draggedHeaderRef,
  headersRef,
  hoveredHeaderRef,
  onTableHeaderDragEnd,
}: UseTableHeaderCellProps) => {
  const { handleDragOver } = useTableHeaderCell({
    draggedHeaderRef,
    headersRef,
    hoveredHeaderRef,
    onTableHeaderDragEnd,
  });

  const throttledHandleDragOver = useRef(
    throttle((header: HeaderObject) => {
      handleDragOver(header);
    }, 10)
  ).current;

  return { throttledHandleDragOver };
};

export default useThrottledHandleDragover;
