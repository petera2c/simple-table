import { SimpleTableVanilla } from "simple-table-core";
import type { CellEditingEmployee } from "./cell-editing.demo-data";
import type { Theme, CellChangeProps, GetRowIdParams } from "simple-table-core";
import { cellEditingConfig } from "./cell-editing.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<CellEditingEmployee>) => row.id;
export function renderCellEditingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<CellEditingEmployee> {
  let rows = [...cellEditingConfig.rows];

  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: cellEditingConfig.headers,
    rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    onCellEdit: ({ accessor, newValue, row }: CellChangeProps<CellEditingEmployee>) => {
      rows = rows.map((item) =>
        item.id === row.id ? { ...item, [accessor]: newValue } : item
      );
      table.update({ rows });
    },
  });
  return table;
}
