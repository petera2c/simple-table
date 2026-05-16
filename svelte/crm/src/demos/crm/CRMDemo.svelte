<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { SvelteHeaderObject, CellChangeProps } from "@simple-table/svelte";
  import { crmData } from "./crm.demo-data";
  import type { CrmShellTheme } from "./crm.demo-data";
  import { syncCrmDemoPalette, crmRowsPerPage } from "./crm-demo-stores";
  import CrmContactCell from "./CrmContactCell.svelte";
  import CrmSignalCell from "./CrmSignalCell.svelte";
  import CrmAiScoreCell from "./CrmAiScoreCell.svelte";
  import CrmEmailCell from "./CrmEmailCell.svelte";
  import CrmTimeAgoCell from "./CrmTimeAgoCell.svelte";
  import CrmListCell from "./CrmListCell.svelte";
  import CrmFitCell from "./CrmFitCell.svelte";
  import CrmContactNowCell from "./CrmContactNowCell.svelte";
  import CrmFooter from "./CrmFooter.svelte";
  import "@simple-table/svelte/styles.css";
  import "./crm-custom-theme.css";

  let { height = "400px", theme }: { height?: string | number; theme?: CrmShellTheme } = $props();

  let data = $state([...crmData]);

  const isDark = $derived(
    theme === "custom-dark" || theme === "dark" || theme === "modern-dark",
  );

  $effect.pre(() => {
    syncCrmDemoPalette(isDark);
  });

  const headers = $derived.by(
    (): SvelteHeaderObject[] => [
      {
        accessor: "name",
        label: "CONTACT",
        width: "2fr",
        minWidth: 290,
        isSortable: true,
        isEditable: true,
        type: "string",
        cellRenderer: CrmContactCell,
      },
      {
        accessor: "signal",
        label: "SIGNAL",
        width: "3fr",
        minWidth: 340,
        isSortable: true,
        isEditable: true,
        type: "string",
        cellRenderer: CrmSignalCell,
      },
      {
        accessor: "aiScore",
        label: "AI SCORE",
        width: "1fr",
        minWidth: 100,
        isSortable: true,
        align: "center",
        type: "number",
        cellRenderer: CrmAiScoreCell,
      },
      {
        accessor: "emailStatus",
        label: "EMAIL",
        width: "1.5fr",
        minWidth: 210,
        isSortable: true,
        align: "center",
        type: "enum",
        enumOptions: [
          { label: "Enrich", value: "Enrich" },
          { label: "Verified", value: "Verified" },
          { label: "Pending", value: "Pending" },
          { label: "Bounced", value: "Bounced" },
        ],
        cellRenderer: CrmEmailCell,
      },
      {
        accessor: "timeAgo",
        label: "IMPORT",
        width: "1fr",
        minWidth: 100,
        isSortable: true,
        align: "center",
        type: "string",
        cellRenderer: CrmTimeAgoCell,
      },
      {
        accessor: "list",
        label: "LIST",
        width: "1.2fr",
        minWidth: 160,
        isSortable: true,
        align: "center",
        type: "enum",
        enumOptions: [
          { label: "Leads", value: "Leads" },
          { label: "Hot Leads", value: "Hot Leads" },
          { label: "Warm Leads", value: "Warm Leads" },
          { label: "Cold Leads", value: "Cold Leads" },
          { label: "Enterprise", value: "Enterprise" },
          { label: "SMB", value: "SMB" },
          { label: "Nurture", value: "Nurture" },
        ],
        valueGetter: ({ row }) => {
          const list = String(row.list);
          const m: Record<string, number> = {
            "Hot Leads": 1,
            "Warm Leads": 2,
            Enterprise: 3,
            Leads: 4,
            SMB: 5,
            "Cold Leads": 6,
            Nurture: 7,
          };
          return m[list] || 999;
        },
        cellRenderer: CrmListCell,
      },
      {
        accessor: "_fit",
        label: "Fit",
        width: "1fr",
        align: "center",
        minWidth: 120,
        cellRenderer: CrmFitCell,
      },
      {
        accessor: "_contactNow",
        label: "",
        width: "1.2fr",
        minWidth: 160,
        cellRenderer: CrmContactNowCell,
      },
    ],
  );

  function handleCellEdit({ accessor, newValue, row }: CellChangeProps) {
    data = data.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item));
  }
</script>

<div class={`custom-theme-container theme-${isDark ? "custom-dark" : "custom-light"}`}>
  <SimpleTable
    columnReordering={true}
    columnResizing={true}
    customTheme={{ headerHeight: 48, rowHeight: 92 }}
    defaultHeaders={headers}
    enableRowSelection={true}
    footerRenderer={CrmFooter}
    {height}
    onCellEdit={handleCellEdit}
    rows={data}
    rowsPerPage={$crmRowsPerPage}
    shouldPaginate={true}
    theme="custom"
  />
</div>
