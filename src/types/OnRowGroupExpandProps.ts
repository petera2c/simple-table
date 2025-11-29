import { MouseEvent } from "react";
import Row from "./Row";

interface OnRowGroupExpandProps {
  row: Row;
  rowIndex: number;
  depth: number;
  event: MouseEvent;
  rowId: string | number;
  groupingKey?: string;
  isExpanded: boolean;
}

export default OnRowGroupExpandProps;
