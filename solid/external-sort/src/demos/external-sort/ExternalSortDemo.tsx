import {SimpleTable, asRows} from "@simple-table/solid";import type { Theme, SortColumn, Row } from "@simple-table/solid";
import { externalSortConfig } from "./external-sort.demo-data";
import { createSignal, createMemo } from "solid-js";
import "@simple-table/solid/styles.css";

export default function ExternalSortDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [sortState, setSortState] = createSignal<SortColumn | null>(null);

  const sortedRows = createMemo((): Row[] => {
    const sort = sortState();
    const rows = [...asRows(externalSortConfig.rows)];
    if (!sort) return rows;
    const accessor = sort.key.accessor as string;
    const type = sort.key.type;
    const dir = sort.direction;
    return rows.sort((a, b) => {
      const aVal = a[accessor];
      const bVal = b[accessor];
      if (aVal === bVal) return 0;
      const cmp =
        type === "number"
          ? (Number(aVal) || 0) - (Number(bVal) || 0)
          : String(aVal).localeCompare(String(bVal));
      return dir === "asc" ? cmp : -cmp;
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
