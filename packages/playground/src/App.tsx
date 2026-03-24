import React, { useRef } from "react";
import { SimpleTable } from "simple-table-react";
import type { TableAPI, ReactHeaderObject, Row, CellRendererProps } from "simple-table-react";

// ─── Sample data ──────────────────────────────────────────────────────────────

const COUNTRIES = ["USA", "China", "Russia", "UK", "Brazil", "Australia", "Japan"];
const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Sam", "Chris", "Lee", "Pat"];
const LAST_NAMES = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Clark"];
const SPORTS = ["Swimming", "Track", "Gymnastics", "Cycling", "Boxing"];

const ROWS: Row[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  country: COUNTRIES[i % COUNTRIES.length],
  athleteName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
  sport: SPORTS[i % SPORTS.length],
  medals: Math.floor(Math.random() * 30) + 1,
  gold: Math.floor(Math.random() * 10),
  personalBest: parseFloat((Math.random() * 60 + 9).toFixed(2)),
  age: Math.floor(Math.random() * 20) + 18,
}));

// ─── Custom React cell renderers ──────────────────────────────────────────────

function MedalCell({ value }: CellRendererProps) {
  const count = Number(value) || 0;
  const color = count >= 20 ? "#22c55e" : count >= 10 ? "#f59e0b" : "#94a3b8";
  return (
    <span style={{ fontWeight: 700, color }}>
      {count} 🏅
    </span>
  );
}

function CountryCell({ value }: CellRendererProps) {
  const flagMap: Record<string, string> = {
    USA: "🇺🇸", China: "🇨🇳", Russia: "🇷🇺",
    UK: "🇬🇧", Brazil: "🇧🇷", Australia: "🇦🇺", Japan: "🇯🇵",
  };
  const flag = flagMap[String(value)] ?? "🏳️";
  return <span>{flag} {String(value)}</span>;
}

// ─── Column definitions ───────────────────────────────────────────────────────

const HEADERS: ReactHeaderObject[] = [
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

// ─── App ──────────────────────────────────────────────────────────────────────

const btnStyle: React.CSSProperties = {
  padding: "6px 14px",
  borderRadius: 6,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#e2e8f0",
  cursor: "pointer",
  fontSize: 13,
};

export default function App() {
  const tableRef = useRef<TableAPI>(null);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 4, fontSize: 20, fontWeight: 700 }}>
        simple-table-react playground
      </h2>
      <p style={{ marginBottom: 16, fontSize: 13, color: "#94a3b8" }}>
        Edit <code>src/App.tsx</code> — changes are instant via Vite HMR.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button
          style={btnStyle}
          onClick={() =>
            tableRef.current?.applySortState({ accessor: "medals", direction: "desc" })
          }
        >
          Sort by medals ↓
        </button>
        <button
          style={btnStyle}
          onClick={() =>
            tableRef.current?.applySortState({ accessor: "gold", direction: "desc" })
          }
        >
          Sort by gold ↓
        </button>
        <button style={btnStyle} onClick={() => tableRef.current?.applySortState()}>
          Clear sort
        </button>
        <button style={btnStyle} onClick={() => tableRef.current?.clearAllFilters()}>
          Clear filters
        </button>
        <button
          style={btnStyle}
          onClick={() => tableRef.current?.exportToCSV({ filename: "athletes.csv" })}
        >
          Export CSV
        </button>
      </div>

      <SimpleTable
        ref={tableRef}
        rows={ROWS}
        defaultHeaders={HEADERS}
        height={560}
        shouldPaginate
        rowsPerPage={25}
        columnResizing
        columnReordering
        theme="modern-dark"
      />
    </div>
  );
}
