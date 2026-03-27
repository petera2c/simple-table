<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { HeaderObject } from "simple-table-core";
  import { headerRendererConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  type SortDir = "asc" | "desc" | null;
  const CYCLE: SortDir[] = ["asc", "desc", null];

  let sortAccessor = $state<string | null>(null);
  let sortDirection = $state<SortDir>(null);

  let sortedData = $derived.by(() => {
    if (!sortAccessor || !sortDirection) return [...headerRendererConfig.rows];
    const acc = sortAccessor;
    const dir = sortDirection;
    return [...headerRendererConfig.rows].sort((a, b) => {
      const aVal = a[acc];
      const bVal = b[acc];
      if (aVal === bVal) return 0;
      const cmp = typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return dir === "asc" ? cmp : -cmp;
    });
  });

  function buildHeaderRenderer(h: HeaderObject) {
    return () => {
      const isSorted = sortAccessor === h.accessor;
      const dir = isSorted ? sortDirection : null;
      const indicator = dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "";

      const wrapper = document.createElement("div");
      Object.assign(wrapper.style, {
        cursor: "pointer",
        userSelect: "none",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      });
      wrapper.addEventListener("click", () => {
        if (!isSorted) {
          sortAccessor = h.accessor as string;
          sortDirection = "asc";
          return;
        }
        const idx = CYCLE.indexOf(dir);
        const next = CYCLE[(idx + 1) % CYCLE.length];
        if (next) {
          sortAccessor = h.accessor as string;
          sortDirection = next;
        } else {
          sortAccessor = null;
          sortDirection = null;
        }
      });

      const label = document.createElement("span");
      label.textContent = h.label;
      wrapper.appendChild(label);

      if (indicator) {
        const ind = document.createElement("span");
        Object.assign(ind.style, { fontSize: "10px", color: "#6366f1" });
        ind.textContent = indicator;
        wrapper.appendChild(ind);
      }

      return wrapper;
    };
  }

  let headers = $derived(
    headerRendererConfig.headers.map((h) => ({
      ...h,
      isSortable: false,
      headerRenderer: buildHeaderRenderer(h),
    }))
  );
</script>

<SimpleTable
  defaultHeaders={headers}
  rows={sortedData}
  {height}
  {theme}
/>
