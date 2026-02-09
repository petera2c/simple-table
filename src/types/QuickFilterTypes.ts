import { Accessor } from "./HeaderObject";
import Row from "./Row";

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

export interface QuickFilterGetterProps {
  row: Row;
  accessor: Accessor;
}

export type QuickFilterGetter = (props: QuickFilterGetterProps) => string;

// Parsed smart filter tokens
export interface SmartFilterToken {
  type: "word" | "phrase" | "negation" | "columnSpecific";
  value: string;
  column?: Accessor; // For column-specific searches
}
