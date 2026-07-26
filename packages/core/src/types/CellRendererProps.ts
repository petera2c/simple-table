import type { Accessor } from "./ColumnDef";
import type Row from "./Row";
import type { RowData } from "./Row";
import type Theme from "./Theme";
import type CellValue from "./CellValue";

interface CellRendererProps<TData extends RowData = Row, TValue = CellValue> {
  accessor: Accessor<TData>;
  colIndex: number;
  row: TData;
  rowIndex: number;
  rowPath?: (string | number)[];
  theme: Theme;
  value: TValue; // The raw cell value
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
export type CellRenderer<TData extends RowData = Row, TValue = CellValue> = (
  props: CellRendererProps<TData, TValue>
) => string | number | null | Node;

export default CellRendererProps;
