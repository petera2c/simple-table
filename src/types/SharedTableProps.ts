import { Ref, MutableRefObject } from "react";
import HeaderObject from "./HeaderObject";

interface SharedTableProps {
  allowAnimations: boolean;
  centerHeaderRef: Ref<HTMLDivElement>;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  headerContainerRef: Ref<HTMLDivElement>;
  headers: HeaderObject[];
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  mainBodyRef: Ref<HTMLDivElement>;
  mainTemplateColumns: string;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftHeaderRef: Ref<HTMLDivElement>;
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject[];
  pinnedRightHeaderRef: Ref<HTMLDivElement>;
  pinnedRightTemplateColumns: string;
  rowHeight: number;
  tableBodyContainerRef: Ref<HTMLDivElement>;
}

export default SharedTableProps;
