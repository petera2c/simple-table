import { RefObject } from "react";
import { HeaderObject } from "..";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import VisibleRow from "./VisibleRow";
import { Row } from "..";
import FlattenedRowWithGrouping from "./FlattenedRowWithGrouping";

interface TableBodyProps {
  flattenedRowsData: FlattenedRowWithGrouping[];
  headerContainerRef: RefObject<HTMLDivElement | null>;
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  setScrollTop: Dispatch<SetStateAction<number>>;
  visibleRows: VisibleRow[];
}

export default TableBodyProps;
