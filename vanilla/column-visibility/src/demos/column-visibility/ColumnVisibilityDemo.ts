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
    defaultHeaders: getColumnVisibilityDemoHeaders(),
    rows: columnVisibilityConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    editColumns: columnVisibilityConfig.tableProps.editColumns,
    editColumnsInitOpen: columnVisibilityConfig.tableProps.editColumnsInitOpen,
    onColumnVisibilityChange: saveColumnVisibilityDemoState,
    columnEditorConfig: {
      ...columnVisibilityConfig.tableProps.columnEditorConfig,
      rowRenderer: buildMarketingStyleColumnEditorRowRenderer,
    },
  });
  return table;
}
