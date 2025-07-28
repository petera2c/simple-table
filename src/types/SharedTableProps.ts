import { RefObject, MutableRefObject } from "react";
import HeaderObject from "./HeaderObject";

interface SharedTableProps<T> {
  allowAnimations: boolean;
  centerHeaderRef: RefObject<HTMLDivElement>;
  draggedHeaderRef: MutableRefObject<HeaderObject<T> | null>;
  headerContainerRef: RefObject<HTMLDivElement>;
  headers: HeaderObject<T>[];
  hoveredHeaderRef: MutableRefObject<HeaderObject<T> | null>;
  mainBodyRef: RefObject<HTMLDivElement>;
  mainTemplateColumns: string;
  onTableHeaderDragEnd: (newHeaders: HeaderObject<T>[]) => void;
  pinnedLeftColumns: HeaderObject<T>[];
  pinnedLeftHeaderRef: RefObject<HTMLDivElement>;
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject<T>[];
  pinnedRightHeaderRef: RefObject<HTMLDivElement>;
  pinnedRightTemplateColumns: string;
  rowHeight: number;
  tableBodyContainerRef: RefObject<HTMLDivElement>;
}

export default SharedTableProps;
