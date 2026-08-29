import { createSignal, createMemo } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, SortColumn } from "@simple-table/solid";
import { externalSortConfig, type SortableEmployee } from "./external-sort.demo-data";
import "@simple-table/solid/styles.css";

export default function ExternalSortDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [sortConfig, setSortConfig] = createSignal<SortColumn | null>(null);

  const sortedData = createMemo(() => {
    const sort = sortConfig();
    if (!sort) return externalSortConfig.rows;
    return [...externalSortConfig.rows].sort((a, b) => {
      const key = sort.key.accessor as keyof SortableEmployee;
      const aVal = a[key];
      const bVal = b[key];
      if (aVal === bVal) return 0;
      const cmp =
        sort.key.type === "number"
          ? (aVal as number) - (bVal as number)
          : String(aVal).localeCompare(String(bVal));
      return sort.direction === "asc" ? cmp : -cmp;
    });
  });

  return (
    <SimpleTable
      columns={externalSortConfig.headers}
      getRowId={({ row }) => row.id}
      rows={sortedData()}
      onSortChange={setSortConfig}
      externalSortHandling
      columnResizing
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
