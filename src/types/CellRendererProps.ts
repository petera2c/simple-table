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

/**
 * CellRenderer return type:
 * - string | number | null: rendered as text in the cell
 * - Node (HTMLElement, DocumentFragment, etc.): appended directly into the cell for full DOM control
 *
 * Example (text):
 *   cellRenderer: ({ value, row }) => `${value} (${row.status})`
 *
 * Example (custom HTML):
 *   cellRenderer: ({ row }) => {
 *     const span = document.createElement('span');
 *     span.className = 'badge';
 *     span.textContent = String(row.status);
 *     return span;
 *   }
 */
export type CellRenderer = (props: CellRendererProps) => string | number | null | Node;

export default CellRendererProps;
