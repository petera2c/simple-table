import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import type { QuickFilterMode } from "simple-table-core";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function QuickFilterDemo(props: { height?: string | number; theme?: Theme }) {
  const [searchText, setSearchText] = createSignal("");
  const [filterMode, setFilterMode] = createSignal<QuickFilterMode>("simple");
  const [caseSensitive, setCaseSensitive] = createSignal(false);

  const modeBtn = (mode: QuickFilterMode, label: string) => ({
    padding: "6px 14px",
    "border-radius": "6px",
    border: filterMode() === mode ? "2px solid #3b82f6" : "1px solid #d1d5db",
    background: filterMode() === mode ? "#eff6ff" : "#fff",
    color: filterMode() === mode ? "#1d4ed8" : "#374151",
    "font-weight": filterMode() === mode ? 600 : 400,
    cursor: "pointer",
    "font-size": "13px",
  });

  return (
    <div>
      <div style={{ display: "flex", "flex-wrap": "wrap", gap: "8px", "margin-bottom": "12px", "align-items": "center" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchText()}
          onInput={(e) => setSearchText(e.currentTarget.value)}
          style={{
            padding: "6px 12px",
            "border-radius": "6px",
            border: "1px solid #d1d5db",
            "font-size": "13px",
            "min-width": "200px",
          }}
        />
        <button onClick={() => setFilterMode("simple")} style={modeBtn("simple", "Simple")}>
          Simple
        </button>
        <button onClick={() => setFilterMode("smart")} style={modeBtn("smart", "Smart")}>
          Smart
        </button>
        <button
          onClick={() => setCaseSensitive((prev) => !prev)}
          style={{
            padding: "6px 14px",
            "border-radius": "6px",
            border: caseSensitive() ? "2px solid #3b82f6" : "1px solid #d1d5db",
            background: caseSensitive() ? "#eff6ff" : "#fff",
            color: caseSensitive() ? "#1d4ed8" : "#374151",
            "font-weight": caseSensitive() ? 600 : 400,
            cursor: "pointer",
            "font-size": "13px",
          }}
        >
          Case Sensitive
        </button>
      </div>
      <SimpleTable
        defaultHeaders={quickFilterConfig.headers}
        rows={quickFilterConfig.rows}
        height={props.height ?? "400px"}
        theme={props.theme}
        quickFilter={{ text: searchText(), mode: filterMode(), caseSensitive: caseSensitive() }}
      />
    </div>
  );
}
