import HeaderObject from "./HeaderObject";

export interface RefObject<T> {
  current: T | null;
}

interface SharedTableProps {
  centerHeaderRef: RefObject<HTMLDivElement | null>;
  draggedHeaderRef: { current: HeaderObject | null };
  headerContainerRef: RefObject<HTMLDivElement | null>;
  headers: HeaderObject[];
  hoveredHeaderRef: { current: HeaderObject | null };
  mainBodyRef: RefObject<HTMLDivElement | null>;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedRightColumns: HeaderObject[];
  pinnedRightHeaderRef: RefObject<HTMLDivElement | null>;
  rowHeight: number;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
}

export default SharedTableProps;
