import { createSignal, For } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { tableHeightConfig } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

const heights = ["200px", "300px", "400px"];

export default function TableHeightDemo(props: { height?: string | number; theme?: Theme }) {
  const [selectedHeight, setSelectedHeight] = createSignal("400px");

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", "margin-bottom": "12px" }}>
        <For each={heights}>
          {(h) => (
            <button
              onClick={() => setSelectedHeight(h)}
              style={{
                padding: "6px 12px",
                "border-radius": "4px",
                border: "1px solid #ccc",
                background: selectedHeight() === h ? "#3b82f6" : "#f3f4f6",
                color: selectedHeight() === h ? "#fff" : "#374151",
                cursor: "pointer",
                "font-size": "14px",
                "font-weight": "500",
              }}
            >
              {h}
            </button>
          )}
        </For>
      </div>
      <SimpleTable
        defaultHeaders={tableHeightConfig.headers}
        rows={tableHeightConfig.rows}
        height={selectedHeight()}
        theme={props.theme}
      />
    </div>
  );
}
