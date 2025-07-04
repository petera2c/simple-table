import { UIEventHandler } from "react";
import { Pinned } from "./Pinned";
import { SortConfig } from "..";
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
  sectionRef: RefObject<HTMLDivElement | null>;
  sort: SortConfig | null;
  width?: number;
}

export default TableHeaderSectionProps;
