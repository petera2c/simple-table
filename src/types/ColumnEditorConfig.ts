/**
 * Configuration options for the column editor/visibility drawer
 */
export interface ColumnEditorConfig {
  /** Text displayed on the column editor button (default: "Columns") */
  text?: string;
  /** Enable search functionality in the column editor (default: true) */
  searchEnabled?: boolean;
  /** Placeholder text for the search input (default: "Search columns...") */
  searchPlaceholder?: string;
}

export const DEFAULT_COLUMN_EDITOR_CONFIG: Required<ColumnEditorConfig> = {
  text: "Columns",
  searchEnabled: true,
  searchPlaceholder: "Search columns...",
};
