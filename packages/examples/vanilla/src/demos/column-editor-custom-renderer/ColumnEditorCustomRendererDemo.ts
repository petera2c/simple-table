import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import {
  columnEditorCustomRendererConfig,
  COLUMN_EDITOR_TEXT,
  COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  buildVanillaColumnEditorRowRenderer,
} from "./column-editor-custom-renderer.demo-data";
import "simple-table-core/styles.css";

export function renderColumnEditorCustomRendererDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...columnEditorCustomRendererConfig.headers],
    rows: columnEditorCustomRendererConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    editColumns: true,
    columnEditorConfig: {
      text: COLUMN_EDITOR_TEXT,
      searchEnabled: true,
      searchPlaceholder: COLUMN_EDITOR_SEARCH_PLACEHOLDER,
      rowRenderer: buildVanillaColumnEditorRowRenderer,
    },
  });
  return table;
}
