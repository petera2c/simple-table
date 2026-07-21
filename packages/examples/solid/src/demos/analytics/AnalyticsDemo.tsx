import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { TableAPI, Theme } from "@simple-table/solid";
import { analyticsDemoConfig, analyticsPresets } from "./analytics.demo-data";
import "@simple-table/solid/styles.css";

function formatHeight(height?: string | number | null): string {
  if (height == null) return "100%";
  if (typeof height === "number") return `${height}px`;
  return height;
}

export default function AnalyticsDemo(props: {
  height?: string | number | null;
  theme?: Theme;
}) {
  const [activeId, setActiveId] = createSignal(analyticsPresets[0].id);
  const [searchText, setSearchText] = createSignal("");
  const [tableHeightPx, setTableHeightPx] = createSignal<number | null>(null);
  let tableHost: HTMLDivElement | undefined;
  let tableApi: TableAPI | undefined;

  const active = createMemo(
    () => analyticsPresets.find((p) => p.id === activeId()) ?? analyticsPresets[0]
  );
  const isPivoted = createMemo(() => active().pivot != null);
  const nestedRows = createMemo(() => (active().pivot?.rows.length ?? 0) > 1);
  const isDark = () => props.theme === "dark" || props.theme === "modern-dark";
  const chromeBg = () => (isDark() ? "#0f172a" : "#f8fafc");
  const chromeBorder = () => (isDark() ? "#1e293b" : "#e2e8f0");
  const titleColor = () => (isDark() ? "#f1f5f9" : "#0f172a");
  const chipIdleBg = () => (isDark() ? "#1e293b" : "#e2e8f0");
  const chipIdleColor = () => (isDark() ? "#cbd5e1" : "#334155");
  const inputBg = () => (isDark() ? "#1e293b" : "#fff");
  const inputBorder = () => (isDark() ? "#334155" : "#cbd5e1");
  const inputColor = () => (isDark() ? "#e2e8f0" : "#0f172a");

  createEffect(() => {
    const el = tableHost;
    if (!el) return;
    const update = () => {
      setTableHeightPx(el.clientHeight);
      const mount = el.firstElementChild as HTMLElement | null;
      if (mount) {
        mount.style.height = "100%";
        mount.style.minHeight = "0";
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    onCleanup(() => ro.disconnect());
  });

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        width: "100%",
        height: formatHeight(props.height ?? "480px"),
        background: chromeBg(),
        border: `1px solid ${chromeBorder()}`,
        "border-radius": "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px 12px",
          "border-bottom": `1px solid ${chromeBorder()}`,
          "flex-shrink": 0,
        }}
      >
        <div style={{ "margin-bottom": "10px" }}>
          <h2
            style={{
              margin: 0,
              "font-size": "18px",
              "font-weight": 650,
              color: titleColor(),
              "letter-spacing": "-0.02em",
            }}
          >
            Revenue Analytics
          </h2>
        </div>
        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "8px", "margin-bottom": "10px" }}>
          <For each={analyticsPresets}>
            {(preset) => {
              const selected = () => preset.id === activeId();
              return (
                <button
                  type="button"
                  onClick={() => setActiveId(preset.id)}
                  style={{
                    padding: "7px 12px",
                    "border-radius": "6px",
                    border: "none",
                    cursor: "pointer",
                    "font-size": "13px",
                    "font-weight": 550,
                    background: selected() ? "#2563eb" : chipIdleBg(),
                    color: selected() ? "#fff" : chipIdleColor(),
                  }}
                >
                  {preset.label}
                </button>
              );
            }}
          </For>
        </div>
        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "8px", "align-items": "center" }}>
          <input
            type="search"
            value={searchText()}
            onInput={(e) => setSearchText(e.currentTarget.value)}
            placeholder="Quick filter…"
            aria-label="Quick filter"
            style={{
              flex: "1 1 180px",
              "max-width": "280px",
              padding: "7px 10px",
              "border-radius": "6px",
              border: `1px solid ${inputBorder()}`,
              background: inputBg(),
              color: inputColor(),
              "font-size": "13px",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => tableApi?.exportToCSV()}
            style={{
              padding: "7px 12px",
              "border-radius": "6px",
              border: `1px solid ${inputBorder()}`,
              cursor: "pointer",
              "font-size": "13px",
              "font-weight": 550,
              background: chipIdleBg(),
              color: chipIdleColor(),
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          "min-height": 0,
          padding: "12px 20px 20px",
          display: "flex",
          "flex-direction": "column",
        }}
      >
        <div ref={(el) => (tableHost = el)} style={{ flex: 1, "min-height": 0 }}>
          <Show when={tableHeightPx() != null ? `${activeId()}:${tableHeightPx()}` : null} keyed>
            <SimpleTable
              ref={(api) => {
                tableApi = api;
              }}
              autoExpandColumns
              columnBorders
              columnReordering
              columnResizing
              copyHeadersToClipboard
              defaultHeaders={analyticsDemoConfig.headers}
              editColumns
              enableStickyParents={nestedRows()}
              expandAll={nestedRows()}
              getRowId={({ row }) => {
                const id = row.id;
                return id == null ? undefined : String(id);
              }}
              height={tableHeightPx()!}
              includeHeadersInCSVExport
              initialSortColumn={isPivoted() ? undefined : "sales"}
              initialSortDirection={isPivoted() ? undefined : "desc"}
              pivot={active().pivot}
              quickFilter={{
                text: searchText(),
                mode: "simple",
                caseSensitive: false,
              }}
              rows={analyticsDemoConfig.rows}
              selectableCells
              theme={props.theme}
              useHoverRowBackground
              useOddEvenRowBackground
            />
          </Show>
        </div>
      </div>
    </div>
  );
}
