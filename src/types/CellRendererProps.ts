import { ReactNode } from "react";
import type { Accessor } from "./HeaderObject";
import type Row from "./Row";
import type Theme from "./Theme";

interface CellRendererProps {
  accessor: Accessor;
  colIndex: number;
  row: Row;
  theme: Theme;
}

export type CellRenderer = (props: CellRendererProps) => ReactNode | string;

export default CellRendererProps;
