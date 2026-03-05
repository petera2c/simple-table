import HeaderObject from "./HeaderObject";

export interface RefObject<T> {
  current: T | null;
}

interface SharedTableProps {
  centerHeaderRef: RefObject<HTMLDivElement>;
  draggedHeaderRef: { current: HeaderObject | null };
  headerContainerRef: RefObject<HTMLDivElement>;
  headers: HeaderObject[];
  hoveredHeaderRef: { current: HeaderObject | null };
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
