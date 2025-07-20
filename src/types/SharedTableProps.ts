import { RefObject, MutableRefObject } from "react";
import HeaderObject from "./HeaderObject";

interface SharedTableProps {
  allowAnimations: boolean;
  centerHeaderRef: RefObject<HTMLDivElement>;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  headerContainerRef: RefObject<HTMLDivElement>;
  headers: HeaderObject[];
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  mainBodyRef: RefObject<HTMLDivElement>;
  mainTemplateColumns: string;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftHeaderRef: RefObject<HTMLDivElement>;
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject[];
  pinnedRightHeaderRef: RefObject<HTMLDivElement>;
  pinnedRightTemplateColumns: string;
  rowHeight: number;
  tableBodyContainerRef: RefObject<HTMLDivElement>;
}

export default SharedTableProps;
