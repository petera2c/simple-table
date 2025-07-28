import { RefObject } from "react";
import SortColumn from "./SortColumn";
import HeaderObject from "./HeaderObject";

type TableHeaderProps<T> = {
  centerHeaderRef: RefObject<HTMLDivElement>;
  headers: HeaderObject<T>[];
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject<T>[];
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject<T>[];
  pinnedRightTemplateColumns: string;
  sort: SortColumn<T> | null;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
};

export default TableHeaderProps;
