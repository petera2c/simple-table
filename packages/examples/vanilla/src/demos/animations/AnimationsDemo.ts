import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { animationsConfig } from "./animations.demo-data";
import "simple-table-core/styles.css";

export function renderAnimationsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: animationsConfig.headers,
    rows: animationsConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnReordering: true,
    editColumns: true,
    editColumnsInitOpen: true,
  });
  return table;
}
