import { useEffect, useRef, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactIconsConfig, TableAPI, Theme } from "@simple-table/react";
import {
  analyticsHeaders,
  analyticsPresets,
  analyticsRows,
} from "./analytics-data";
import "@simple-table/react/styles.css";

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "70dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

export default function AnalyticsExample({
  height,
  icons,
  onGridReady,
  theme,
}: {
  height?: string | number | null;
  icons?: ReactIconsConfig;
  onGridReady?: () => void;
  theme?: Theme;
}) {
  const [activeId, setActiveId] = useState(analyticsPresets[0].id);
  const active = analyticsPresets.find((p) => p.id === activeId) ?? analyticsPresets[0];
  const isPivoted = active.pivot != null;
  const nestedRows = (active.pivot?.rows.length ?? 0) > 1;
  const isDark = theme === "dark" || theme === "modern-dark";
  const tableHostRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<TableAPI>(null);
  const [tableHeightPx, setTableHeightPx] = useState<number | null>(null);

  // Measure the flex fill area and pass a pixel height so the table gets a real
  // scroll viewport. maxHeight="100%" fails because React's mount <div> grows
  // with content, so % resolves against an unbounded parent.
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
  const chipActiveBg = "#2563eb";
  const chipIdleBg = isDark ? "#1e293b" : "#e2e8f0";
  const chipIdleColor = isDark ? "#cbd5e1" : "#334155";
  const inputBorder = isDark ? "#334155" : "#cbd5e1";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: formatTableHeight(height),
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
                  background: selected ? chipActiveBg : chipIdleBg,
                  color: selected ? "#fff" : chipIdleColor,
                }}
              >
                {preset.label}
              </button>
            );
          })}
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
              defaultHeaders={analyticsHeaders}
              editColumns
              enableStickyParents={nestedRows}
              expandAll={nestedRows}
              getRowId={({ row }) => {
                const id = row.id;
                return id == null ? undefined : String(id);
              }}
              height={tableHeightPx}
              icons={icons}
              includeHeadersInCSVExport
              initialSortColumn={isPivoted ? undefined : "sales"}
              initialSortDirection={isPivoted ? undefined : "desc"}
              onGridReady={onGridReady}
              pivot={active.pivot}
              rows={analyticsRows}
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
}
