import { Dispatch, ReactNode, SetStateAction, UIEvent, UIEventHandler } from "react";
import Row from "./Row";
import { Pinned } from "./Pinned";
import { OnSortProps, SortConfig } from "..";
import { HeaderObject } from "..";
import { RefObject } from "react";

interface TableHeaderSectionProps {
  allowAnimations: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  currentRows: Row[];
  draggedHeaderRef: RefObject<HeaderObject | null>;
  forceUpdate: () => void;
  gridTemplateColumns: string;
  handleScroll?: UIEventHandler<HTMLDivElement>;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isWidthDragging: boolean;
  lastSelectedColumnIndex?: number | null;
  mainBodyRef: RefObject<HTMLDivElement | null>;
  maxDepth: number;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinned?: Pinned;
  rowHeight: number;
  sectionRef: RefObject<HTMLDivElement | null>;
  selectableColumns: boolean;
  selectColumns?: (columnIndices: number[], isShiftKey?: boolean) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
}

export default TableHeaderSectionProps;
