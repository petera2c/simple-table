import type HeaderObject from "./HeaderObject";

export interface ColumnEditorCustomRendererProps {
  /** The current headers array */
  headers: HeaderObject[];
  /** Pre-built search input section, or null if search is disabled */
  searchSection: HTMLElement | null;
  /** Pre-built column list section with drag-and-drop, checkboxes, etc. */
  listSection: HTMLElement;
  /** Pre-built reset button section, or null if no default headers are configured */
  resetSection: HTMLElement | null;
  /** Function to reset columns to their default configuration */
  resetColumns?: () => void;
}

export type ColumnEditorCustomRenderer = (
  props: ColumnEditorCustomRendererProps,
) => HTMLElement | string | null;
