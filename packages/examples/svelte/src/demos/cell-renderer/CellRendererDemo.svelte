<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { HeaderObject } from "simple-table-core";
  import { cellRendererConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const headers: HeaderObject[] = cellRendererConfig.headers.map((h) => {
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const status = String(row.status);
          const icon = status === "active" ? "●" : status === "pending" ? "◐" : "○";
          return `${icon} ${status}`;
        },
      };
    }
    if (h.accessor === "progress") {
      return {
        ...h,
        cellRenderer: ({ value }) => `${value}%`,
      };
    }
    if (h.accessor === "rating") {
      return {
        ...h,
        cellRenderer: ({ value }) => "★".repeat(Number(value)) + "☆".repeat(5 - Number(value)),
      };
    }
    if (h.accessor === "verified") {
      return {
        ...h,
        cellRenderer: ({ value }) => (value ? "Yes" : "No"),
      };
    }
    if (h.accessor === "tags") {
      return {
        ...h,
        cellRenderer: ({ value }) =>
          Array.isArray(value) ? value.join(", ") : String(value),
      };
    }
    return { ...h };
  });
</script>

<SimpleTable
  defaultHeaders={headers}
  rows={cellRendererConfig.rows}
  {height}
  {theme}
/>
