import ColumnDef from "./ColumnDef";

export interface RefObject<T> {
  current: T | null;
}

interface SharedTableProps {
  centerHeaderRef: RefObject<HTMLDivElement | null>;
  draggedHeaderRef: { current: ColumnDef | null };
  headerContainerRef: RefObject<HTMLDivElement | null>;
  headers: ColumnDef[];
  hoveredHeaderRef: { current: ColumnDef | null };
  mainBodyRef: RefObject<HTMLDivElement | null>;
  onTableHeaderDragEnd: (newHeaders: ColumnDef[]) => void;
  pinnedLeftColumns: ColumnDef[];
  pinnedLeftHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedRightColumns: ColumnDef[];
  pinnedRightHeaderRef: RefObject<HTMLDivElement | null>;
  rowHeight: number;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
}

export default SharedTableProps;
