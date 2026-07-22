import SortColumn from "./SortColumn";
import ColumnDef from "./ColumnDef";

export interface RefObject<T> {
  current: T | null;
}

type TableHeaderProps = {
  calculatedHeaderHeight: number;
  centerHeaderRef: RefObject<HTMLDivElement | null>;
  headers: ColumnDef[];
  mainBodyWidth: number;
  pinnedLeftColumns: ColumnDef[];
  pinnedLeftWidth: number;
  pinnedRightColumns: ColumnDef[];
  pinnedRightWidth: number;
  sort: SortColumn | null;
};

export default TableHeaderProps;
