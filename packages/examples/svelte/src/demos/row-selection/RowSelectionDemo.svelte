<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, RowSelectionChangeProps, HeaderObject } from "@simple-table/svelte";
  import { rowSelectionConfig, rowSelectionData } from "@simple-table/examples-shared";
  import type { LibraryBook } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";

  let { height = "348px", theme }: { height?: string | number; theme?: Theme } = $props();

  let selectedBooks: LibraryBook[] = $state([]);

  let selectedTitles = $derived(
    selectedBooks.length > 0
      ? selectedBooks.map((b) => b.title).join(", ")
      : "None",
  );

  const headers: HeaderObject[] = rowSelectionConfig.headers.map((h) => {
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
          const s = String(row.status);
          const color = s === "Available" ? "#16a34a" : s === "Checked Out" ? "#ea580c" : "#dc2626";
          return `<span style="color:${color};font-weight:bold">${s}</span>`;
        },
      };
    }
    return { ...h };
  });

  function handleRowSelectionChange(props: RowSelectionChangeProps) {
    selectedBooks = rowSelectionData.filter((book) =>
      props.selectedRows.has(String(book.id)),
    );
  }
</script>

<div style="display: flex; flex-direction: column; gap: 12px;">
  <div style="padding: 12px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
    <div style="font-weight: bold; margin-bottom: 4px; color: #0c4a6e;">
      Library Management Demo
    </div>
    <div style="font-size: 13px; color: #475569; margin-bottom: 6px;">
      Click rows to select books. Use the checkbox column to select multiple.
    </div>
    <div style="font-size: 13px; color: #334155;">
      <strong>Selected Books: </strong>{selectedTitles}
    </div>
  </div>

  <SimpleTable
    defaultHeaders={headers}
    rows={rowSelectionConfig.rows}
    enableRowSelection={true}
    columnResizing={true}
    columnReordering={true}
    selectableCells={true}
    onRowSelectionChange={handleRowSelectionChange}
    {height}
    {theme}
  />
</div>
