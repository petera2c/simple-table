import HeaderObject from "./HeaderObject";
import { ColumnEditorRowRenderer } from "./ColumnEditorRowRendererProps";
import { ColumnEditorCustomRenderer } from "./ColumnEditorCustomRendererProps";

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
  /**
   * When false, hides pin/unpin controls (L/R) in the column editor. Pinned sections still appear if columns are pinned.
   * Default: true.
   */
  allowColumnPinning?: boolean;
  /** Custom renderer for column editor row layout to reposition icons and labels */
  rowRenderer?: ColumnEditorRowRenderer;
  /** Custom renderer for the entire column editor panel. Receives pre-built sections (search, list, reset) and headers. */
  customRenderer?: ColumnEditorCustomRenderer;
}

export const DEFAULT_COLUMN_EDITOR_CONFIG: Required<
  Omit<ColumnEditorConfig, "searchFunction" | "rowRenderer" | "customRenderer">
> = {
  text: "Columns",
  searchEnabled: true,
  searchPlaceholder: "Search columns...",
  allowColumnPinning: true,
};

/** Column editor config with defaults applied (text, searchEnabled, searchPlaceholder are required) */
export type MergedColumnEditorConfig = Required<
  Pick<ColumnEditorConfig, "text" | "searchEnabled" | "searchPlaceholder" | "allowColumnPinning">
> &
  Pick<ColumnEditorConfig, "searchFunction" | "rowRenderer" | "customRenderer">;
