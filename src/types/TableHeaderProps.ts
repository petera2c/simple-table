import { Ref } from "react";
import SortColumn from "./SortColumn";
import HeaderObject from "./HeaderObject";

type TableHeaderProps = {
  centerHeaderRef: Ref<HTMLDivElement>;
  headers: HeaderObject[];
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  sort: SortColumn | null;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
};

export default TableHeaderProps;
