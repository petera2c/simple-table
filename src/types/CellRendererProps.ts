import { ReactNode } from "react";
import type { Accessor } from "./HeaderObject";
import type Row from "./Row";
import type Theme from "./Theme";
import type CellValue from "./CellValue";

interface CellRendererProps {
  accessor: Accessor;
  colIndex: number;
  row: Row;
  rowIndex: number;
  rowPath?: (string | number)[];
  theme: Theme;
  value: CellValue; // The raw cell value
  formattedValue?: string | number | string[] | number[] | null | undefined | boolean; // The formatted cell value (from valueFormatter if present)
}

export type CellRenderer = (props: CellRendererProps) => ReactNode | string;

export default CellRendererProps;
