import { RefObject } from "react";
import SortColumn from "./SortColumn";
import HeaderObject from "./HeaderObject";

type TableHeaderProps = {
  calculatedHeaderHeight: number;
  centerHeaderRef: RefObject<HTMLDivElement>;
  headers: HeaderObject[];
  mainBodyWidth: number;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightWidth: number;
  sort: SortColumn | null;
};

export default TableHeaderProps;
