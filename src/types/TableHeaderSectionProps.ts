import { UIEventHandler, RefObject } from "react";
import { Pinned } from "./Pinned";
import SortColumn from "./SortColumn";
import { HeaderObject } from "..";
import { ColumnIndices } from "../utils/columnIndicesUtils";

interface TableHeaderSectionProps {
  calculatedHeaderHeight: number;
  columnIndices: ColumnIndices;
  gridTemplateColumns: string;
  handleScroll?: UIEventHandler<HTMLDivElement>;
  headers: HeaderObject[];
  leftOffset?: number;
  maxDepth: number;
  pinned?: Pinned;
  sectionRef: RefObject<HTMLDivElement>;
  sort: SortColumn | null;
  width?: number;
}

export default TableHeaderSectionProps;
