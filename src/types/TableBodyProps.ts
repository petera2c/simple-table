import { RefObject } from "react";
import { HeaderObject } from "..";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import VisibleRow from "./VisibleRow";
import { Row } from "..";

interface TableBodyProps {
  flattenedRowsData: Array<{ row: Row; depth: number; groupingKey?: string }>;
  headerContainerRef: RefObject<HTMLDivElement | null>;
  isWidthDragging: boolean;
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  setFlattenedRows: Dispatch<SetStateAction<Row[]>>;
  setScrollTop: Dispatch<SetStateAction<number>>;
  visibleRows: VisibleRow[];
}

export default TableBodyProps;
