import { UIEventHandler } from "react";
import { Pinned } from "./Pinned";
import { SortColumn } from "./SortConfig";
import { HeaderObject } from "..";
import { RefObject } from "react";
import { ColumnIndices } from "../utils/columnIndicesUtils";

interface TableHeaderSectionProps {
  columnIndices: ColumnIndices;
  gridTemplateColumns: string;
  handleScroll?: UIEventHandler<HTMLDivElement>;
  headers: HeaderObject[];
  maxDepth: number;
  pinned?: Pinned;
  sectionRef: RefObject<HTMLDivElement>;
  sort: SortColumn | null;
  width?: number;
}

export default TableHeaderSectionProps;
