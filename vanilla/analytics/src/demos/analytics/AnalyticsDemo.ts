import { SimpleTableVanilla } from "simple-table-core";
import type { AnalyticsFactRow } from "./analytics.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { analyticsDemoConfig, analyticsPresets } from "./analytics.demo-data";
import "simple-table-core/styles.css";

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

export function renderAnalyticsDemo(
  container: HTMLElement,
  options?: { height?: string | number | null; theme?: Theme }
): SimpleTableVanilla<AnalyticsFactRow> {
  let activeId = analyticsPresets[0].id;
  let table: SimpleTableVanilla<AnalyticsFactRow> | null = null;

  const chrome = getAnalyticsChrome(options?.theme);

  const root = document.createElement("div");
  root.style.cssText = `display:flex;flex-direction:column;width: 100%;height:${formatHeight(
    options?.height ?? "480px"
  )};overflow:hidden`;

  const toolbar = document.createElement("div");
  toolbar.style.cssText = `padding:0 0 12px;border-bottom:1px solid ${chrome.border};flex-shrink:0`;

  const titleBlock = document.createElement("div");
  titleBlock.style.marginBottom = "10px";

  const title = document.createElement("h2");
  title.textContent = "Revenue Analytics";
  title.style.cssText = `margin:0;font-size:18px;font-weight:650;color:${chrome.title};letter-spacing:-0.02em`;

  const row = document.createElement("div");
  row.style.cssText =
    "display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;width: 100%";

  const buttons = document.createElement("div");
  buttons.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;align-items:center";

  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.textContent = "Export CSV";
  exportBtn.style.cssText = `padding:7px 12px;border-radius:6px;border:1px solid ${chrome.border};cursor:pointer;font-size:13px;font-weight:550;background:${chrome.chipIdleBg};color:${chrome.chipIdleColor}`;
  exportBtn.addEventListener("click", () => table?.getAPI().exportToCSV());

  const tablePad = document.createElement("div");
  tablePad.style.cssText = "flex:1;min-height:0;display:flex;flex-direction:column";
  const tableHost = document.createElement("div");
  tableHost.style.cssText = "flex:1;min-height:0;height:100%";
  tablePad.appendChild(tableHost);

  const remountTable = () => {
    tableHost.replaceChildren();
    const active = analyticsPresets.find((p) => p.id === activeId) ?? analyticsPresets[0];
    const pivoted = active.pivot != null;
    table = new SimpleTableVanilla(tableHost, {
      autoExpandColumns: true,
      columnBorders: true,
      columnReordering: true,
      columnResizing: true,
      copyHeadersToClipboard: true,
      columns: analyticsDemoConfig.headers,
      enableColumnEditor: true,
      getRowId: ({ row }) => {
        const id = row.id;
        return id == null ? undefined : String(id);
      },
      height: "100%",
      includeHeadersInCSVExport: true,
      initialSortColumn: pivoted ? undefined : "sales",
      initialSortDirection: pivoted ? undefined : "desc",
      pivot: active.pivot,
      rows: analyticsDemoConfig.rows,
      selectableCells: true,
      theme: options?.theme,
      hoverRowBackground: true,
      oddEvenRowBackground: true,
    });
  };

  const paint = () => {
    buttons.replaceChildren();
    for (const preset of analyticsPresets) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = preset.label;
      const selected = preset.id === activeId;
      btn.style.cssText = `padding:7px 12px;border-radius:6px;border:none;cursor:pointer;font-size:13px;font-weight:550;background:${
        selected ? chrome.chipActive : chrome.chipIdleBg
      };color:${selected ? "#fff" : chrome.chipIdleColor}`;
      btn.addEventListener("click", () => {
        activeId = preset.id;
        paint();
        remountTable();
      });
      buttons.appendChild(btn);
    }
  };

  paint();
  titleBlock.append(title);
  row.append(buttons, exportBtn);
  toolbar.append(titleBlock, row);
  root.append(toolbar, tablePad);
  container.replaceChildren(root);
  remountTable();
  return table!;
}
