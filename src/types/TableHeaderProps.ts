import { RefObject } from "react";
import SortColumn from "./SortColumn";
import HeaderObject from "./HeaderObject";

type TableHeaderProps = {
  calculatedHeaderHeight: number;
  centerHeaderRef: RefObject<HTMLDivElement>;
  headers: HeaderObject[];
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  sort: SortColumn | null;
};

export default TableHeaderProps;
