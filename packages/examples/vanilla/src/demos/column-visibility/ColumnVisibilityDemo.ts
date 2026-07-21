import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import {
  buildMarketingStyleColumnEditorRowRenderer,
  columnVisibilityConfig,
  getColumnVisibilityDemoHeaders,
  saveColumnVisibilityDemoState,
} from "./column-visibility.demo-data";
import "simple-table-core/styles.css";

export function renderColumnVisibilityDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    columns: getColumnVisibilityDemoHeaders(),
    rows: columnVisibilityConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    enableColumnEditor: columnVisibilityConfig.tableProps.enableColumnEditor,
    enableColumnEditorInitOpen: columnVisibilityConfig.tableProps.enableColumnEditorInitOpen,
    onColumnVisibilityChange: saveColumnVisibilityDemoState,
    columnEditorConfig: {
      ...columnVisibilityConfig.tableProps.columnEditorConfig,
      rowRenderer: buildMarketingStyleColumnEditorRowRenderer,
    },
  });
  return table;
}
