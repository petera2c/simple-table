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

// BREAKING CHANGE: CellRenderer now returns string | number | null instead of ReactNode
// React components are no longer supported in cell renderers
// Users should use valueFormatter for formatting, or return simple strings/numbers
// Example:
//   cellRenderer: ({ value, row }) => `${value} (${row.status})`
export type CellRenderer = (props: CellRendererProps) => string | number | null;

export default CellRendererProps;
