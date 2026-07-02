import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, CellChangeProps } from "simple-table-core";
import { cellEditingConfig } from "./cell-editing.demo-data";
import "simple-table-core/styles.css";

export function renderCellEditingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let rows = [...cellEditingConfig.rows];

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: cellEditingConfig.headers,
    rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    onCellEdit: ({ accessor, newValue, row }: CellChangeProps) => {
      rows = rows.map((item) =>
        item.id === row.id ? { ...item, [accessor]: newValue } : item
      );
      table.update({ rows });
    },
  });
  return table;
}
