import { MutableRefObject, RefObject } from "react";
import HeaderObject from "./HeaderObject";

interface SharedTableProps {
  allowAnimations: boolean;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  isWidthDragging: boolean;
  mainTemplateColumns: string;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  shouldDisplayLastColumnCell: boolean;
  tableRef: RefObject<HTMLDivElement | null>;
}

export default SharedTableProps;
