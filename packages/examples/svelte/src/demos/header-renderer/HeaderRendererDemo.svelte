<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteColumnDef, GetRowIdParams } from "@simple-table/svelte";
  import { headerRendererConfig } from "./header-renderer.demo-data";
  import type { HeaderEmployee } from "./header-renderer.demo-data";
  import HeaderSortableHeader from "./HeaderSortableHeader.svelte";
  import { headerDemoSortAccessor, headerDemoSortDirection } from "./header-sort-store";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<HeaderEmployee>) => row.id;

  const sortedData = $derived.by(() => {
    const acc = $headerDemoSortAccessor as keyof HeaderEmployee | null;
    const dir = $headerDemoSortDirection;
    if (!acc || !dir) return [...headerRendererConfig.rows];
    return [...headerRendererConfig.rows].sort((a, b) => {
      const aVal = a[acc];
      const bVal = b[acc];
      if (aVal === bVal) return 0;
      const cmp =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
      return dir === "asc" ? cmp : -cmp;
    });
  });

  const headers = $derived(
    headerRendererConfig.headers.map(
      (h): SvelteColumnDef<HeaderEmployee> => ({
        ...h,
        sortable: false,
        headerRenderer: HeaderSortableHeader,
      }),
    ),
  );
</script>

<SimpleTable columns={headers} rows={sortedData} {getRowId} {height} {theme} />
