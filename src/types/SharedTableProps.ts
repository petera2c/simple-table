import { RefObject } from "react";
import HeaderObject from "./HeaderObject";

interface SharedTableProps {
  allowAnimations: boolean;
  centerHeaderRef: RefObject<HTMLDivElement | null>;
  draggedHeaderRef: RefObject<HeaderObject | null>;
  headerContainerRef: RefObject<HTMLDivElement | null>;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isWidthDragging: boolean;
  mainBodyRef: RefObject<HTMLDivElement | null>;
  mainTemplateColumns: string;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject[];
  pinnedRightHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedRightTemplateColumns: string;
  rowHeight: number;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
}

export default SharedTableProps;
