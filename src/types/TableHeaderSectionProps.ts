import { UIEventHandler } from "react";
import { Pinned } from "./Pinned";
import { SortConfig } from "..";
import { HeaderObject } from "..";
import { RefObject } from "react";

interface TableHeaderSectionProps {
  gridTemplateColumns: string;
  handleScroll?: UIEventHandler<HTMLDivElement>;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  maxDepth: number;
  pinned?: Pinned;
  sectionRef: RefObject<HTMLDivElement | null>;
  sort: SortConfig | null;
}

export default TableHeaderSectionProps;
