import { createMemo, createSignal, For } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { pivotDemoConfig, pivotPresets } from "./pivot.demo-data";
import "@simple-table/solid/styles.css";

export default function PivotDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [activeId, setActiveId] = createSignal(pivotPresets[0].id);
  const active = createMemo(
    () => pivotPresets.find((p) => p.id === activeId()) ?? pivotPresets[0]
  );
  const nestedRows = createMemo(() => active().pivot.rows.length > 1);

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px", width: "100%" }}>
      <div style={{ display: "flex", "flex-wrap": "wrap", gap: "8px" }}>
        <For each={pivotPresets}>
          {(preset) => {
            const selected = () => preset.id === activeId();
            return (
              <button
                type="button"
                onClick={() => setActiveId(preset.id)}
                style={{
                  padding: "6px 12px",
                  "border-radius": "6px",
                  border: "none",
                  cursor: "pointer",
                  "font-size": "13px",
                  "font-weight": 500,
                  background: selected() ? "#2563eb" : "#e5e7eb",
                  color: selected() ? "#fff" : "#374151",
                }}
              >
                {preset.label}
              </button>
            );
          }}
        </For>
      </div>
      <SimpleTable
        columns={pivotDemoConfig.headers}
        rows={pivotDemoConfig.rows}
        pivot={active().pivot}
        columnResizing
        expandAll={nestedRows()}
        height={props.height ?? "400px"}
        selectableCells
        theme={props.theme}
      />
    </div>
  );
}
