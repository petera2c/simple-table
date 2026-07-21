import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { analyticsDemoConfig, analyticsPresets } from "./analytics.demo-data";
import "simple-table-core/styles.css";

function formatHeight(height?: string | number | null): string {
  if (height == null) return "100%";
  if (typeof height === "number") return `${height}px`;
  return height;
}

export function renderAnalyticsDemo(
  container: HTMLElement,
  options?: { height?: string | number | null; theme?: Theme }
): SimpleTableVanilla {
  let activeId = analyticsPresets[0].id;
  let searchText = "";
  let table: SimpleTableVanilla | null = null;

  const isDark = options?.theme === "dark" || options?.theme === "modern-dark";
  const chromeBg = isDark ? "#0f172a" : "#f8fafc";
  const chromeBorder = isDark ? "#1e293b" : "#e2e8f0";
  const titleColor = isDark ? "#f1f5f9" : "#0f172a";
  const chipIdleBg = isDark ? "#1e293b" : "#e2e8f0";
  const chipIdleColor = isDark ? "#cbd5e1" : "#334155";
  const inputBg = isDark ? "#1e293b" : "#fff";
  const inputBorder = isDark ? "#334155" : "#cbd5e1";
  const inputColor = isDark ? "#e2e8f0" : "#0f172a";

  const root = document.createElement("div");
  root.style.cssText = `display:flex;flex-direction:column;width:100%;height:${formatHeight(
    options?.height ?? "480px"
  )};background:${chromeBg};border:1px solid ${chromeBorder};border-radius:8px;overflow:hidden`;

  const chrome = document.createElement("div");
  chrome.style.cssText = `padding:16px 20px 12px;border-bottom:1px solid ${chromeBorder};flex-shrink:0`;

  const titleBlock = document.createElement("div");
  titleBlock.style.marginBottom = "10px";

  const title = document.createElement("h2");
  title.textContent = "Revenue Analytics";
  title.style.cssText = `margin:0;font-size:18px;font-weight:650;color:${titleColor};letter-spacing:-0.02em`;

  const buttons = document.createElement("div");
  buttons.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px";

  const toolbar = document.createElement("div");
  toolbar.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;align-items:center";

  const search = document.createElement("input");
  search.type = "search";
  search.placeholder = "Quick filter…";
  search.setAttribute("aria-label", "Quick filter");
  search.style.cssText = `flex:1 1 180px;max-width:280px;padding:7px 10px;border-radius:6px;border:1px solid ${inputBorder};background:${inputBg};color:${inputColor};font-size:13px;outline:none`;
  search.addEventListener("input", () => {
    searchText = search.value;
    table?.updateConfig({
      quickFilter: { text: searchText, mode: "simple", caseSensitive: false },
    });
  });

  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.textContent = "Export CSV";
  exportBtn.style.cssText = `padding:7px 12px;border-radius:6px;border:1px solid ${inputBorder};cursor:pointer;font-size:13px;font-weight:550;background:${chipIdleBg};color:${chipIdleColor}`;
  exportBtn.addEventListener("click", () => table?.getAPI().exportToCSV());

  toolbar.append(search, exportBtn);

  const tablePad = document.createElement("div");
  tablePad.style.cssText =
    "flex:1;min-height:0;padding:12px 20px 20px;display:flex;flex-direction:column";
  const tableHost = document.createElement("div");
  tableHost.style.cssText = "flex:1;min-height:0;height:100%";
  tablePad.appendChild(tableHost);

  const remountTable = () => {
    tableHost.replaceChildren();
    const active = analyticsPresets.find((p) => p.id === activeId) ?? analyticsPresets[0];
    const nested = (active.pivot?.rows.length ?? 0) > 1;
    const pivoted = active.pivot != null;
    table = new SimpleTableVanilla(tableHost, {
      autoExpandColumns: true,
      columnBorders: true,
      columnReordering: true,
      columnResizing: true,
      copyHeadersToClipboard: true,
      defaultHeaders: analyticsDemoConfig.headers,
      editColumns: true,
      enableStickyParents: nested,
      expandAll: nested,
      getRowId: ({ row }) => {
        const id = row.id;
        return id == null ? undefined : String(id);
      },
      height: "100%",
      includeHeadersInCSVExport: true,
      initialSortColumn: pivoted ? undefined : "sales",
      initialSortDirection: pivoted ? undefined : "desc",
      pivot: active.pivot,
      quickFilter: { text: searchText, mode: "simple", caseSensitive: false },
      rows: analyticsDemoConfig.rows,
      selectableCells: true,
      theme: options?.theme,
      useHoverRowBackground: true,
      useOddEvenRowBackground: true,
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
        selected ? "#2563eb" : chipIdleBg
      };color:${selected ? "#fff" : chipIdleColor}`;
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
  chrome.append(titleBlock, buttons, toolbar);
  root.append(chrome, tablePad);
  container.replaceChildren(root);
  remountTable();
  return table!;
}
