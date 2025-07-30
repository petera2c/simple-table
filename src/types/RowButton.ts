import { ReactNode } from "react";
import Row from "./Row";

export interface RowButtonProps {
  row: Row;
}

export type RowButton = (props: RowButtonProps) => ReactNode;
