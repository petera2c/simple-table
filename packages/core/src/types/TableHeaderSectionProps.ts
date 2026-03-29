import { Pinned } from "./Pinned";
import SortColumn from "./SortColumn";
import { HeaderObject } from "..";
import { ColumnIndices } from "../utils/columnIndicesUtils";

interface TableHeaderSectionProps {
  calculatedHeaderHeight: number;
  columnIndices: ColumnIndices;
  handleScroll?: (event: UIEvent) => void;
  headers: HeaderObject[];
  leftOffset?: number;
  maxDepth: number;
  pinned?: Pinned;
  sectionRef: { current: HTMLDivElement | null };
  sort: SortColumn | null;
  width?: number;
}

export default TableHeaderSectionProps;
