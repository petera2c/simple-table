<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, TableFilterState } from "@simple-table/svelte";
  import { externalFilterConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let filters = $state<TableFilterState>({});

  let filteredRows = $derived.by(() => {
    const data = externalFilterConfig.rows;
    const entries = Object.entries(filters);
    if (entries.length === 0) return [...data];

    return data.filter((row) =>
      entries.every(([, condition]) => {
        const cellValue = row[condition.accessor as string];
        const { operator, value, values } = condition;
        switch (operator) {
          case "contains":
            return String(cellValue ?? "").toLowerCase().includes(String(value ?? "").toLowerCase());
          case "equals":
            return cellValue === value;
          case "notEquals":
            return cellValue !== value;
          case "greaterThan":
            return Number(cellValue) > Number(value);
          case "lessThan":
            return Number(cellValue) < Number(value);
          case "greaterThanOrEqual":
            return Number(cellValue) >= Number(value);
          case "lessThanOrEqual":
            return Number(cellValue) <= Number(value);
          case "startsWith":
            return String(cellValue ?? "").toLowerCase().startsWith(String(value ?? "").toLowerCase());
          case "endsWith":
            return String(cellValue ?? "").toLowerCase().endsWith(String(value ?? "").toLowerCase());
          case "in":
            return values ? values.includes(cellValue) : true;
          case "notIn":
            return values ? !values.includes(cellValue) : true;
          case "isEmpty":
            return cellValue == null || cellValue === "";
          case "isNotEmpty":
            return cellValue != null && cellValue !== "";
          default:
            return true;
        }
      }),
    );
  });

  function handleFilterChange(newFilters: TableFilterState) {
    filters = newFilters;
  }
</script>

<SimpleTable
  defaultHeaders={externalFilterConfig.headers}
  rows={filteredRows}
  externalFilterHandling={true}
  columnResizing={externalFilterConfig.tableProps.columnResizing}
  onFilterChange={handleFilterChange}
  {height}
  {theme}
/>
