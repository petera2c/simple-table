import { useEffect, useRef, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { TableAPI, Theme } from "@simple-table/react";
import { analyticsDemoConfig, analyticsPresets } from "./analytics.demo-data";
import "@simple-table/react/styles.css";

function formatHeight(height?: string | number | null): string {
  if (height == null) return "100%";
  if (typeof height === "number") return `${height}px`;
  return height;
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
  const nestedRows = (active.pivot?.rows.length ?? 0) > 1;
  const isDark = theme === "dark" || theme === "modern-dark";
  const tableHostRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<TableAPI>(null);
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

  const chromeBg = isDark ? "#0f172a" : "#f8fafc";
  const chromeBorder = isDark ? "#1e293b" : "#e2e8f0";
  const titleColor = isDark ? "#f1f5f9" : "#0f172a";
  const chipIdleBg = isDark ? "#1e293b" : "#e2e8f0";
  const chipIdleColor = isDark ? "#cbd5e1" : "#334155";
  const inputBorder = isDark ? "#334155" : "#cbd5e1";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: formatHeight(height),
        background: chromeBg,
        border: `1px solid ${chromeBorder}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: `1px solid ${chromeBorder}`,
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 650,
              color: titleColor,
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
                    background: selected ? "#2563eb" : chipIdleBg,
                    color: selected ? "#fff" : chipIdleColor,
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
              border: `1px solid ${inputBorder}`,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 550,
              background: chipIdleBg,
              color: chipIdleColor,
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
          padding: "12px 20px 20px",
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
              defaultHeaders={analyticsDemoConfig.headers}
              editColumns
              enableStickyParents={nestedRows}
              expandAll={nestedRows}
              getRowId={({ row }) => {
                const id = row.id;
                return id == null ? undefined : String(id);
              }}
              height={tableHeightPx}
              includeHeadersInCSVExport
              initialSortColumn={isPivoted ? undefined : "sales"}
              initialSortDirection={isPivoted ? undefined : "desc"}
              pivot={active.pivot}
              rows={analyticsDemoConfig.rows}
              selectableCells
              theme={theme}
              useHoverRowBackground
              useOddEvenRowBackground
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDemo;
