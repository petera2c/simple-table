import SortColumn from "./SortColumn";
import HeaderObject from "./HeaderObject";

export interface RefObject<T> {
  current: T | null;
}

type TableHeaderProps = {
  calculatedHeaderHeight: number;
  centerHeaderRef: RefObject<HTMLDivElement | null>;
  headers: HeaderObject[];
  mainBodyWidth: number;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightWidth: number;
  sort: SortColumn | null;
};

export default TableHeaderProps;
