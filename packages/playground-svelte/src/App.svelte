<script lang="ts">
  import { SimpleTable } from "simple-table-svelte";
  import type { SvelteHeaderObject, TableAPI, Row } from "simple-table-svelte";
  import MedalCell from "./MedalCell.svelte";
  import CountryCell from "./CountryCell.svelte";

  // ─── Sample data ──────────────────────────────────────────────────────────────

  const COUNTRIES = ["USA", "China", "Russia", "UK", "Brazil", "Australia", "Japan"];
  const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Sam", "Chris", "Lee", "Pat"];
  const LAST_NAMES = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Clark"];
  const SPORTS = ["Swimming", "Track", "Gymnastics", "Cycling", "Boxing"];

  const rows: Row[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    country: COUNTRIES[i % COUNTRIES.length],
    athleteName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    sport: SPORTS[i % SPORTS.length],
    medals: Math.floor(Math.random() * 30) + 1,
    gold: Math.floor(Math.random() * 10),
    personalBest: parseFloat((Math.random() * 60 + 9).toFixed(2)),
    age: Math.floor(Math.random() * 20) + 18,
  }));

  // ─── Column definitions ───────────────────────────────────────────────────────

  const headers: SvelteHeaderObject[] = [
    { accessor: "id", label: "ID", width: 60 },
    {
      accessor: "country",
      label: "Country",
      width: 140,
      isSortable: true,
      filterable: true,
      cellRenderer: CountryCell,
    },
    { accessor: "athleteName", label: "Athlete", width: 180, isSortable: true },
    { accessor: "sport", label: "Sport", width: 130, isSortable: true, filterable: true },
    {
      accessor: "medals",
      label: "Total Medals",
      width: 140,
      isSortable: true,
      type: "number",
      cellRenderer: MedalCell,
    },
    { accessor: "gold", label: "Gold 🥇", width: 90, isSortable: true, type: "number" },
    {
      accessor: "personalBest",
      label: "Personal Best (s)",
      width: 160,
      isSortable: true,
      type: "number",
      valueFormatter: ({ value }) => `${Number(value).toFixed(2)}s`,
    },
    { accessor: "age", label: "Age", width: 80, isSortable: true, type: "number" },
  ];

  // ─── Ref & styles ─────────────────────────────────────────────────────────────

  let tableComponent: { getAPI: () => TableAPI | null } | undefined = $state();

  const btnStyle =
    "padding: 6px 14px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: #e2e8f0; cursor: pointer; font-size: 13px;";
</script>

<div style="padding: 24px">
  <h2 style="margin-bottom: 4px; font-size: 20px; font-weight: 700">
    simple-table-svelte playground
  </h2>
  <p style="margin-bottom: 16px; font-size: 13px; color: #94a3b8">
    Edit <code>src/App.svelte</code> — changes are instant via Vite HMR.
  </p>

  <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap">
    <button style={btnStyle} onclick={() => tableComponent?.getAPI()?.applySortState({ accessor: "medals", direction: "desc" })}>
      Sort by medals ↓
    </button>
    <button style={btnStyle} onclick={() => tableComponent?.getAPI()?.applySortState({ accessor: "gold", direction: "desc" })}>
      Sort by gold ↓
    </button>
    <button style={btnStyle} onclick={() => tableComponent?.getAPI()?.applySortState()}>Clear sort</button>
    <button style={btnStyle} onclick={() => tableComponent?.getAPI()?.clearAllFilters()}>Clear filters</button>
    <button style={btnStyle} onclick={() => tableComponent?.getAPI()?.exportToCSV({ filename: "athletes.csv" })}>
      Export CSV
    </button>
  </div>

  <SimpleTable
    bind:this={tableComponent}
    {rows}
    defaultHeaders={headers}
    height={560}
    shouldPaginate={true}
    rowsPerPage={25}
    columnResizing={true}
    columnReordering={true}
    theme="modern-dark"
  />
</div>
