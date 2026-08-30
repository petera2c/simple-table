import { useEffect, useRef, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { TableAPI, Theme } from "@simple-table/react";
import {
  analyticsDemoConfig,
  analyticsPresets,
  type AnalyticsFactRow,
} from "./analytics.demo-data";
import "@simple-table/react/styles.css";

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

const AnalyticsDemo = ({
  height = "480px",
  theme,
}: {
  height?: string | number | null;
  theme?: Theme;
}) => {
  const [activeId, setActiveId] = useState(analyticsPresets[0].id);
  const active = analyticsPresets.find((p) => p.id === activeId) ?? analyticsPresets[0];
  const isPivoted = active.pivot != null;
  const chrome = getAnalyticsChrome(theme);
  const tableHostRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<TableAPI<AnalyticsFactRow>>(null);
  const [tableHeightPx, setTableHeightPx] = useState<number | null>(null);

  useEffect(() => {
    const el = tableHostRef.current;
    if (!el) return;
    const update = () => {
      const next = el.clientHeight;
      setTableHeightPx((prev) => (prev === next ? prev : next));
      const mount = el.firstElementChild as HTMLElement | null;
      if (mount) {
        mount.style.height = "100%";
        mount.style.minHeight = "0";
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: formatHeight(height),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "0 0 12px",
          borderBottom: `1px solid ${chrome.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 650,
              color: chrome.title,
              letterSpacing: "-0.02em",
            }}
          >
            Revenue Analytics
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {analyticsPresets.map((preset) => {
              const selected = preset.id === activeId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActiveId(preset.id)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 550,
                    background: selected ? chrome.chipActive : chrome.chipIdleBg,
                    color: selected ? "#fff" : chrome.chipIdleColor,
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => tableRef.current?.exportToCSV()}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              border: `1px solid ${chrome.border}`,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 550,
              background: chrome.chipIdleBg,
              color: chrome.chipIdleColor,
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div ref={tableHostRef} style={{ flex: 1, minHeight: 0 }}>
          {tableHeightPx != null && (
            <SimpleTable
              key={activeId}
              ref={tableRef}
              autoExpandColumns
              columnBorders
              columnReordering
              columnResizing
              copyHeadersToClipboard
              columns={analyticsDemoConfig.headers}
              enableColumnEditor
              getRowId={({ row }) => row.id}
              height={tableHeightPx}
              includeHeadersInCSVExport
              initialSortColumn={isPivoted ? undefined : "sales"}
              initialSortDirection={isPivoted ? undefined : "desc"}
              pivot={active.pivot}
              rows={analyticsDemoConfig.rows}
              selectableCells
              theme={theme}
              hoverRowBackground
              oddEvenRowBackground
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDemo;
