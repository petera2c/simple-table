import { UIEventHandler, Ref } from "react";
import { Pinned } from "./Pinned";
import SortColumn from "./SortColumn";
import { HeaderObject } from "..";
import { ColumnIndices } from "../utils/columnIndicesUtils";

interface TableHeaderSectionProps {
  columnIndices: ColumnIndices;
  gridTemplateColumns: string;
  handleScroll?: UIEventHandler<HTMLDivElement>;
  headers: HeaderObject[];
  maxDepth: number;
  pinned?: Pinned;
  sectionRef: Ref<HTMLDivElement>;
  sort: SortColumn | null;
  width?: number;
}

export default TableHeaderSectionProps;
