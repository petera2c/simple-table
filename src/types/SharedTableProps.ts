import { MutableRefObject, RefObject } from "react";
import HeaderObject from "./HeaderObject";

interface SharedTableProps {
  allowAnimations: boolean;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  isWidthDragging: boolean;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinned?: "left" | "right";
  shouldDisplayLastColumnCell: boolean;
  tableRef: RefObject<HTMLDivElement | null>;
}

export default SharedTableProps;
