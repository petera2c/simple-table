import { SimpleTableVanilla } from "../core/SimpleTableVanilla";
import type { SimpleTableConfigInput } from "../utils/normalizeConfig";
import type { RowData } from "../types/Row";
import type Row from "../types/Row";
import { createTdgpTableSource } from "./createTdgpTableSource";
import type { TdgpTableSource, TdgpTableSourceOptions } from "./types";

export type MountTdgpTableOptions<TData extends RowData = Row> = TdgpTableSourceOptions<TData> & {
  /** Extra table config (height, theme, columnResizing). Applied after TDGP table props. */
  tableConfig?: Omit<SimpleTableConfigInput<TData>, "rows" | "columns">;
};

export type MountedTdgpTable<TData extends RowData = Row> = {
  table: SimpleTableVanilla<TData>;
  source: TdgpTableSource<TData>;
  destroy: () => void;
};

/**
 * Mounts a Simple Table that loads pages, sorts, filters, and optional groups
 * from a TDGP server. Call destroy() to stop loads and remove the table.
 */
export function mountTdgpTable<TData extends RowData = Row>(
  container: HTMLElement,
  options: MountTdgpTableOptions<TData>,
): MountedTdgpTable<TData> {
  const { tableConfig, ...sourceOptions } = options;
  const source = createTdgpTableSource(sourceOptions);
  const snapshot = source.getSnapshot();

  const table = new SimpleTableVanilla(container, {
    ...snapshot.tableProps,
    ...tableConfig,
    columns: snapshot.columns,
    rows: snapshot.rows,
  });
  table.mount();

  const unsubscribe = source.subscribe(() => {
    const next = source.getSnapshot();
    table.update({
      ...next.tableProps,
      ...tableConfig,
      columns: next.columns,
      rows: next.rows,
    });
  });

  source.start();

  return {
    table,
    source,
    destroy() {
      source.stop();
      unsubscribe();
      table.destroy();
    },
  };
}
