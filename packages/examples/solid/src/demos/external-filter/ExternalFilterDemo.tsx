import { createSignal, createMemo } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableFilterState } from "@simple-table/solid";
import { externalFilterConfig, matchesFilter } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

export default function ExternalFilterDemo(props: { height?: string | number; theme?: Theme }) {
  const [filters, setFilters] = createSignal<TableFilterState>({});

  const filteredData = createMemo(() => {
    const entries = Object.entries(filters());
    if (entries.length === 0) return externalFilterConfig.rows;

    return externalFilterConfig.rows.filter((row) =>
      entries.every(([accessor, filter]) =>
        matchesFilter(row[accessor as keyof typeof row] as any, filter)
      )
    );
  });

  return (
    <SimpleTable
      defaultHeaders={externalFilterConfig.headers}
      rows={filteredData()}
      onFilterChange={setFilters}
      externalFilterHandling
      columnResizing
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
