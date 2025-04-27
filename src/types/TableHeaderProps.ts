import { RefObject } from "react";
import SortConfig from "./SortConfig";
import HeaderObject from "./HeaderObject";

type TableHeaderProps = {
  centerHeaderRef: RefObject<HTMLDivElement | null>;
  headerContainerRef: RefObject<HTMLDivElement | null>;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  sort: SortConfig | null;
};

export default TableHeaderProps;
