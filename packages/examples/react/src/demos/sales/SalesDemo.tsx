import { useState, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, CellChangeProps, CellRendererProps, ReactHeaderObject } from "@simple-table/react";
import { salesConfig, getSalesThemeColors } from "./sales.demo-data";
import type { SalesRow } from "./sales.demo-data";
import "@simple-table/react/styles.css";

function getHeaders(): ReactHeaderObject[] {
  const headers = JSON.parse(JSON.stringify(salesConfig.headers)) as ReactHeaderObject[];

  const addRenderers = (hdrs: ReactHeaderObject[]) => {
    for (const h of hdrs) {
      if (h.accessor === "dealValue") {
        h.cellRenderer = ({ row: r, theme }: CellRendererProps) => {
          const d = r as unknown as SalesRow;
          const c = getSalesThemeColors(theme);
          let style: React.CSSProperties = { color: c.gray };
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
        h.cellRenderer = ({ row: r }: CellRendererProps) => {
          const d = r as unknown as SalesRow;
          const s = d.isWon ? { bg: "#f6ffed", text: "#2a6a0d" } : { bg: "#fff1f0", text: "#a8071a" };
          return (
            <span style={{ backgroundColor: s.bg, color: s.text, padding: "0 7px", fontSize: "12px", lineHeight: "20px", borderRadius: "2px", display: "inline-block" }}>
              {d.isWon ? "Won" : "Lost"}
            </span>
          );
        };
      }
      if (h.accessor === "commission") {
        h.cellRenderer = ({ row: r, theme }: CellRendererProps) => {
          const d = r as unknown as SalesRow;
          const c = getSalesThemeColors(theme);
          if (d.commission === 0) return <span style={{ color: c.grayMuted }}>$0.00</span>;
          return `$${d.commission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        };
      }
      if (h.accessor === "profitMargin") {
        h.cellRenderer = ({ row: r, theme }: CellRendererProps) => {
          const d = r as unknown as SalesRow;
          const c = getSalesThemeColors(theme);
          let colorStyle: React.CSSProperties = { color: c.gray };
          if (d.profitMargin >= 0.7) colorStyle = c.successHigh;
          else if (d.profitMargin >= 0.5) colorStyle = { color: c.successMedium };
          else if (d.profitMargin >= 0.4) colorStyle = { color: c.successLow };
          else if (d.profitMargin >= 0.3) colorStyle = { color: c.info };
          else colorStyle = { color: c.warning };
          const barColor = d.profitMargin >= 0.5 ? c.progressHigh : d.profitMargin >= 0.3 ? c.progressMedium : c.progressLow;
          return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <span style={colorStyle}>{(d.profitMargin * 100).toFixed(1)}%</span>
              <div style={{ marginLeft: "8px", width: "48px" }}>
                <div style={{ backgroundColor: "#f5f5f5", height: "6px", width: "100%", borderRadius: "100px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.profitMargin * 100}%`, backgroundColor: barColor, borderRadius: "100px" }} />
                </div>
              </div>
            </div>
          );
        };
      }
      if (h.accessor === "dealProfit") {
        h.cellRenderer = ({ row: r, theme }: CellRendererProps) => {
          const d = r as unknown as SalesRow;
          const c = getSalesThemeColors(theme);
          if (d.dealProfit === 0) return <span style={{ color: c.grayMuted }}>$0.00</span>;
          let style: React.CSSProperties = { color: c.gray };
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
      if (h.children) addRenderers(h.children as ReactHeaderObject[]);
    }
  };
  addRenderers(headers);
  return headers;
}

const SalesDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  const [data, setData] = useState([...salesConfig.rows]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) => prev.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item)));
  };

  return (
    <SimpleTable autoExpandColumns={!isMobile} columnResizing columnReordering defaultHeaders={getHeaders()} editColumns height={height} initialSortColumn="dealValue" initialSortDirection="desc" onCellEdit={handleCellEdit} rows={data} selectableCells theme={theme} />
  );
};

export default SalesDemo;
