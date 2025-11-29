import { MouseEvent } from "react";
import Row from "./Row";

interface OnRowExpandProps {
  row: Row;
  rowIndex: number;
  depth: number;
  event: MouseEvent;
  rowId: string | number;
  groupingKey?: string;
  isExpanded: boolean;
}

export default OnRowExpandProps;
