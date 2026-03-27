import { createSignal, For } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { themesConfig, AVAILABLE_THEMES } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function ThemesDemo(props: { height?: string | number; theme?: Theme }) {
  const [selectedTheme, setSelectedTheme] = createSignal<Theme>(props.theme ?? "light");

  return (
    <div>
      <div style={{ display: "flex", "flex-wrap": "wrap", gap: "8px", "margin-bottom": "12px" }}>
        <For each={AVAILABLE_THEMES}>
          {(t) => (
            <button
              onClick={() => setSelectedTheme(t.value)}
              style={{
                padding: "6px 14px",
                "border-radius": "6px",
                border: selectedTheme() === t.value ? "2px solid #3b82f6" : "1px solid #d1d5db",
                background: selectedTheme() === t.value ? "#eff6ff" : "#fff",
                color: selectedTheme() === t.value ? "#1d4ed8" : "#374151",
                "font-weight": selectedTheme() === t.value ? 600 : 400,
                cursor: "pointer",
                "font-size": "13px",
              }}
            >
              {t.label}
            </button>
          )}
        </For>
      </div>
      <SimpleTable
        defaultHeaders={themesConfig.headers}
        rows={themesConfig.rows}
        height={props.height ?? "400px"}
        theme={selectedTheme()}
      />
    </div>
  );
}
