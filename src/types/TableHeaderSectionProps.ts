import { Dispatch, ReactNode, SetStateAction, UIEvent } from "react";
import Row from "./Row";
import { Pinned } from "../enums/Pinned";
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
  handleScroll?: (event: UIEvent<HTMLDivElement>) => void;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isWidthDragging: boolean;
  mainBodyRef: RefObject<HTMLDivElement | null>;
  maxDepth: number;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinned?: Pinned;
  rowHeight: number;
  sectionRef: RefObject<HTMLDivElement | null>;
  selectableColumns: boolean;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  setSelectedCells: Dispatch<SetStateAction<Set<string>>>;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
}

export default TableHeaderSectionProps;
