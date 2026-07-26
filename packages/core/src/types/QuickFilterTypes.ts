import { Accessor } from "./ColumnDef";
import Row from "./Row";
import type { RowData } from "./Row";

export type QuickFilterMode = "simple" | "smart";

export interface QuickFilterConfig {
  // Core functionality
  text: string; // The search text (controlled by consumer)

  // Column selection
  columns?: Accessor[]; // Optional: limit search to specific columns (default: all columns)

  // Behavior options
  caseSensitive?: boolean; // Default: false
  mode?: QuickFilterMode; // Default: 'simple'
  useFormattedValue?: boolean; // Default: true (search what users see)

  // Callback
  onChange?: (text: string) => void; // Called when filter changes
}

export interface QuickFilterGetterProps<TData extends RowData = Row> {
  row: TData;
  accessor: Accessor<TData>;
}

export type QuickFilterGetter<TData extends RowData = Row> = (
  props: QuickFilterGetterProps<TData>
) => string;

// Parsed smart filter tokens
export interface SmartFilterToken {
  type: "word" | "phrase" | "negation" | "columnSpecific";
  value: string;
  column?: Accessor; // For column-specific searches
}
