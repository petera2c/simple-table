import { RefObject } from "react";
import SortConfig from "./SortConfig";
import HeaderObject from "./HeaderObject";

type TableHeaderProps = {
  centerHeaderRef: RefObject<HTMLDivElement | null>;
  headerContainerRef: RefObject<HTMLDivElement | null>;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  isWidthDragging: boolean;
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject[];
  pinnedRightHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedRightTemplateColumns: string;
  sort: SortConfig | null;
};

export default TableHeaderProps;
