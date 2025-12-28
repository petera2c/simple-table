import { ReactNode } from "react";
import Row from "./Row";

export interface RowButtonProps {
  row: Row;
  rowIndex: number; // The position of the row in the table
  rowId: string | number; // The unique identifier for the row
}

export type RowButton = (props: RowButtonProps) => ReactNode;
