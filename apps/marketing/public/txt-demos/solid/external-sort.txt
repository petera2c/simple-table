import { SimpleTable } from "@simple-table/solid";
import type { Theme, SortColumn } from "@simple-table/solid";
import { externalSortConfig } from "@simple-table/examples-shared";
import { createSignal, createMemo } from "solid-js";
import "@simple-table/solid/styles.css";

export default function ExternalSortDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [sortState, setSortState] = createSignal<SortColumn | null>(null);

  const sortedRows = createMemo(() => {
    const sort = sortState();
    const rows = [...externalSortConfig.rows];
    if (!sort) return rows;
    const accessor = sort.key.accessor as string;
    return rows.sort((a, b) => {
      const aVal = a[accessor];
      const bVal = b[accessor];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === "asc" ? cmp : -cmp;
    });
  });

  return (
    <SimpleTable
      defaultHeaders={externalSortConfig.headers}
      rows={sortedRows()}
      height={props.height ?? "400px"}
      theme={props.theme}
      externalSortHandling={true}
      columnResizing={true}
      onSortChange={(sort) => setSortState(sort)}
    />
  );
}
