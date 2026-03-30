import { createSignal, createEffect, onCleanup } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidHeaderObject } from "@simple-table/solid";
import type { CellChangeProps } from "simple-table-core";
import { salesConfig, getSalesThemeColors } from "@simple-table/examples-shared";
import type { SalesRow } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

function getHeaders(): SolidHeaderObject[] {
  const headers: SolidHeaderObject[] = JSON.parse(JSON.stringify(salesConfig.headers));

  const addRenderers = (hdrs: SolidHeaderObject[]) => {
    for (const h of hdrs) {
      if (h.accessor === "dealValue") {
        h.cellRenderer = ({ row, theme }) => {
          const d = row as unknown as SalesRow;
          if (row.dealValue === "—") return "—";
          const c = getSalesThemeColors(theme);
          let style: Record<string, string> = { color: c.gray };
          if (d.dealValue > 100000) style = c.successHigh;
          else if (d.dealValue > 50000) style = { color: c.successMedium };
          else if (d.dealValue > 10000) style = { color: c.successLow };
          return (
            <span style={style}>
              ${d.dealValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          );
        };
      }
      if (h.accessor === "isWon") {
        h.cellRenderer = ({ row }) => {
          if (row.isWon === "—") return "—";
          const d = row as unknown as SalesRow;
          const s = d.isWon ? { bg: "#f6ffed", text: "#2a6a0d" } : { bg: "#fff1f0", text: "#a8071a" };
          return (
            <span style={{ "background-color": s.bg, color: s.text, padding: "0 7px", "font-size": "12px", "line-height": "20px", "border-radius": "2px", display: "inline-block" }}>
              {d.isWon ? "Won" : "Lost"}
            </span>
          );
        };
      }
      if (h.accessor === "commission") {
        h.cellRenderer = ({ row, theme }) => {
          if (row.commission === "—") return "—";
          const d = row as unknown as SalesRow;
          const c = getSalesThemeColors(theme);
          if (d.commission === 0) return <span style={{ color: c.grayMuted }}>$0.00</span>;
          return `$${d.commission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        };
      }
      if (h.accessor === "profitMargin") {
        h.cellRenderer = ({ row, theme }) => {
          if (row.profitMargin === "—") return "—";
          const d = row as unknown as SalesRow;
          const c = getSalesThemeColors(theme);
          let colorStyle: Record<string, string> = { color: c.gray };
          if (d.profitMargin >= 0.7) colorStyle = c.successHigh;
          else if (d.profitMargin >= 0.5) colorStyle = { color: c.successMedium };
          else if (d.profitMargin >= 0.4) colorStyle = { color: c.successLow };
          else if (d.profitMargin >= 0.3) colorStyle = { color: c.info };
          else colorStyle = { color: c.warning };
          const barColor = d.profitMargin >= 0.5 ? c.progressHigh : d.profitMargin >= 0.3 ? c.progressMedium : c.progressLow;
          return (
            <div style={{ display: "flex", "align-items": "center", "justify-content": "flex-end" }}>
              <span style={colorStyle}>{(d.profitMargin * 100).toFixed(1)}%</span>
              <div style={{ "margin-left": "8px", width: "48px" }}>
                <div style={{ "background-color": "#f5f5f5", height: "6px", width: "100%", "border-radius": "100px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.profitMargin * 100}%`, "background-color": barColor, "border-radius": "100px" }} />
                </div>
              </div>
            </div>
          );
        };
      }
      if (h.accessor === "dealProfit") {
        h.cellRenderer = ({ row, theme }) => {
          if (row.dealProfit === "—") return "—";
          const d = row as unknown as SalesRow;
          const c = getSalesThemeColors(theme);
          if (d.dealProfit === 0) return <span style={{ color: c.grayMuted }}>$0.00</span>;
          let style: Record<string, string> = { color: c.gray };
          if (d.dealProfit > 50000) style = c.successHigh;
          else if (d.dealProfit > 20000) style = { color: c.successMedium };
          else if (d.dealProfit > 10000) style = { color: c.successLow };
          return (
            <span style={style}>
              ${d.dealProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          );
        };
      }
      if (h.children) addRenderers(h.children as SolidHeaderObject[]);
    }
  };
  addRenderers(headers);
  return headers;
}

export default function SalesDemo(props: { height?: string | number; theme?: Theme }) {
  const [data, setData] = createSignal([...salesConfig.rows]);
  const [isMobile, setIsMobile] = createSignal(false);

  createEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    onCleanup(() => window.removeEventListener("resize", check));
  });

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) => prev.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item)));
  };

  return (
    <SimpleTable autoExpandColumns={!isMobile()} columnResizing columnReordering defaultHeaders={getHeaders()} editColumns height={props.height ?? "400px"} initialSortColumn="dealValue" initialSortDirection="desc" onCellEdit={handleCellEdit} rows={data()} selectableCells theme={props.theme} />
  );
}
