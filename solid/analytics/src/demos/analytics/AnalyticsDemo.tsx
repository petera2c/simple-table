import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { TableAPI, Theme } from "@simple-table/solid";
import { analyticsDemoConfig, analyticsPresets, type AnalyticsFactRow } from "./analytics.demo-data";
import "@simple-table/solid/styles.css";

function formatHeight(height?: string | number | null): string {
  if (height == null) return "100%";
  if (typeof height === "number") return `${height}px`;
  return height;
}

function getAnalyticsChrome(theme?: Theme) {
  if (theme === "modern-black") {
    return {
      border: "#262626",
      chipActive: "#3b82f6",
      chipIdleBg: "#1c1c1c",
      chipIdleColor: "#a3a3a3",
      title: "#fafafa",
    };
  }
  if (theme === "modern-dark" || theme === "dark") {
    return {
      border: "#374151",
      chipActive: "#3b82f6",
      chipIdleBg: "#1f2937",
      chipIdleColor: "#d1d5db",
      title: "#f9fafb",
    };
  }
  return {
    border: "#e5e5e5",
    chipActive: "#2563eb",
    chipIdleBg: "#f5f5f5",
    chipIdleColor: "#525252",
    title: "#171717",
  };
}

export default function AnalyticsDemo(props: {
  height?: string | number | null;
  theme?: Theme;
}) {
  const [activeId, setActiveId] = createSignal(analyticsPresets[0].id);
  const [tableHeightPx, setTableHeightPx] = createSignal<number | null>(null);
  let tableHost: HTMLDivElement | undefined;
  let tableApi: TableAPI<AnalyticsFactRow> | undefined;

  const active = createMemo(
    () => analyticsPresets.find((p) => p.id === activeId()) ?? analyticsPresets[0]
  );
  const isPivoted = createMemo(() => active().pivot != null);
  const chrome = () => getAnalyticsChrome(props.theme);

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
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "0 0 12px",
          "border-bottom": `1px solid ${chrome().border}`,
          "flex-shrink": 0,
        }}
      >
        <div style={{ "margin-bottom": "10px" }}>
          <h2
            style={{
              margin: 0,
              "font-size": "18px",
              "font-weight": 650,
              color: chrome().title,
              "letter-spacing": "-0.02em",
            }}
          >
            Revenue Analytics
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            "flex-wrap": "wrap",
            gap: "8px",
            "align-items": "center",
            "justify-content": "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", "flex-wrap": "wrap", gap: "8px", "align-items": "center" }}>
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
                      background: selected() ? chrome().chipActive : chrome().chipIdleBg,
                      color: selected() ? "#fff" : chrome().chipIdleColor,
                    }}
                  >
                    {preset.label}
                  </button>
                );
              }}
            </For>
          </div>
          <button
            type="button"
            onClick={() => tableApi?.exportToCSV()}
            style={{
              padding: "7px 12px",
              "border-radius": "6px",
              border: `1px solid ${chrome().border}`,
              cursor: "pointer",
              "font-size": "13px",
              "font-weight": 550,
              background: chrome().chipIdleBg,
              color: chrome().chipIdleColor,
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
              columns={analyticsDemoConfig.headers}
              enableColumnEditor
              getRowId={({ row }) => {
                const id = row.id;
                return id == null ? undefined : String(id);
              }}
              height={tableHeightPx()!}
              includeHeadersInCSVExport
              initialSortColumn={isPivoted() ? undefined : "sales"}
              initialSortDirection={isPivoted() ? undefined : "desc"}
              pivot={active().pivot}
              rows={analyticsDemoConfig.rows}
              selectableCells
              theme={props.theme}
              hoverRowBackground
              oddEvenRowBackground
            />
          </Show>
        </div>
      </div>
    </div>
  );
}
