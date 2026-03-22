import { ReactNode } from "react";
import HeaderObject from "./HeaderObject";
import { ColumnEditorRowRenderer } from "./ColumnEditorRowRendererProps";

/**
 * Props passed to the column editor custom renderer
 */
export interface ColumnEditorCustomRendererProps {
  /** The search input section (when searchEnabled) */
  searchSection: ReactNode;
  /** The list of column checkboxes (pinned left, then unpinned, then pinned right) */
  listSection: ReactNode;
  /** Pinned-left section list only */
  pinnedLeftList?: ReactNode;
  /** Unpinned (main) section list only */
  unpinnedList?: ReactNode;
  /** Pinned-right section list only */
  pinnedRightList?: ReactNode;
  /** Flattened headers for all panel sections combined (left, then main, then right) */
  flattenedHeaders: import("../components/simple-table/table-column-editor/columnEditorUtils").FlattenedHeader[];
  /** Current search term */
  searchTerm: string;
  /** Setter for search term */
  setSearchTerm: (term: string) => void;
  /** Whether search is enabled */
  searchEnabled: boolean;
  /** Search placeholder text */
  searchPlaceholder: string;
  /** All headers (unflattened) */
  headers: HeaderObject[];
  /** Reset columns to default order and visibility */
  resetColumns: () => void;
}

/**
 * Custom renderer for the entire column editor popout content.
 * Receives the default search and list sections as props for flexible layout.
 */
export type ColumnEditorCustomRenderer = (props: ColumnEditorCustomRendererProps) => ReactNode;

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
  /** Custom renderer for the entire column editor popout. Receives searchSection, listSection, flattenedHeaders, searchTerm, etc. */
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
