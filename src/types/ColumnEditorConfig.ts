import HeaderObject from "./HeaderObject";

/**
 * Custom search function for filtering columns in the column editor
 * @param header - The header object to check
 * @param searchTerm - The current search term
 * @returns true if the header matches the search term, false otherwise
 */
export type ColumnEditorSearchFunction = (header: HeaderObject, searchTerm: string) => boolean;

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
  /** Custom search function to override default search behavior. Receives header and searchTerm, returns true if header matches. */
  searchFunction?: ColumnEditorSearchFunction;
}

export const DEFAULT_COLUMN_EDITOR_CONFIG: Required<Omit<ColumnEditorConfig, "searchFunction">> = {
  text: "Columns",
  searchEnabled: true,
  searchPlaceholder: "Search columns...",
};
