import { ReactNode } from "react";
import Row from "./Row";

export interface RowButtonProps {
  row: Row;
  rowIndex: number; // The position of the row in the table
}

export type RowButton = (props: RowButtonProps) => ReactNode;
