import { createEffect, createSignal, onCleanup } from "solid-js";
import {SimpleTable} from "@simple-table/solid";import type { Theme, SolidHeaderObject, CellChangeProps } from "@simple-table/solid";
import { getThemeColors, salesHeadersCore, salesSampleRows, type SalesRow } from "./sales.demo-data";
import "@simple-table/solid/styles.css";

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "70dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

function getHeaders(): SolidHeaderObject[] {
  const headers = JSON.parse(JSON.stringify(salesHeadersCore));

  const addRenderers = (hdrs: SolidHeaderObject[]) => {
    for (const h of hdrs) {
      if (h.accessor === "dealValue") {
        h.cellRenderer = ({ row, theme }) => {
          if (row.dealValue === "—") return "—";
          const value = row.dealValue as number;
          const colors = getThemeColors(theme);
          let style: Record<string, string> = { color: colors.gray };
          if (value > 100000) style = { ...colors.success.high };
          else if (value > 50000) style = { color: colors.success.medium };
          else if (value > 10000) style = { color: colors.success.low };
          return (
            <span style={style}>
              $
              {value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          );
        };
      }
      if (h.accessor === "isWon") {
        h.cellRenderer = ({ row }) => {
          if (row.isWon === "—") return "—";
          const d = row as unknown as SalesRow;
          const s = d.isWon
            ? { bg: "#f6ffed", text: "#2a6a0d" }
            : { bg: "#fff1f0", text: "#a8071a" };
          return (
            <span
              style={{
                "background-color": s.bg,
                color: s.text,
                padding: "0 7px",
                "font-size": "12px",
                "line-height": "20px",
                "border-radius": "2px",
                display: "inline-block",
              }}
            >
              {d.isWon ? "Won" : "Lost"}
            </span>
          );
        };
      }
      if (h.accessor === "commission") {
        h.cellRenderer = ({ row, theme }) => {
          if (row.commission === "—") return "—";
          const value = row.commission as number;
          const colors = getThemeColors(theme);
          if (value === 0) return <span style={{ color: colors.grayMuted }}>$0.00</span>;
          return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        };
      }
      if (h.accessor === "profitMargin") {
        h.cellRenderer = ({ row, theme }) => {
          if (row.profitMargin === "—") return "—";
          const value = row.profitMargin as number;
          const colors = getThemeColors(theme);
          let colorStyle: Record<string, string> = { color: colors.gray };
          if (value >= 0.7) colorStyle = { ...colors.success.high };
          else if (value >= 0.5) colorStyle = { color: colors.success.medium };
          else if (value >= 0.4) colorStyle = { color: colors.success.low };
          else if (value >= 0.3) colorStyle = { color: colors.info };
          else colorStyle = { color: colors.warning };
          const barColor =
            value >= 0.5
              ? colors.progressColors.high
              : value >= 0.3
                ? colors.progressColors.medium
                : colors.progressColors.low;
          return (
            <div style={{ display: "flex", "align-items": "center", "justify-content": "flex-end" }}>
              <span style={colorStyle}>{(value * 100).toFixed(1)}%</span>
              <div style={{ "margin-left": "8px", width: "48px" }}>
                <div
                  style={{
                    "background-color": "#f5f5f5",
                    height: "6px",
                    width: "100%",
                    "border-radius": "100px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${value * 100}%`,
                      "background-color": barColor,
                      "border-radius": "100px",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        };
      }
      if (h.accessor === "dealProfit") {
        h.cellRenderer = ({ row, theme }) => {
          if (row.dealProfit === "—") return "—";
          const value = row.dealProfit as number;
          const colors = getThemeColors(theme);
          if (value === 0) return <span style={{ color: colors.grayMuted }}>$0.00</span>;
          let style: Record<string, string> = { color: colors.gray };
          if (value > 50000) style = { ...colors.success.high };
          else if (value > 20000) style = { color: colors.success.medium };
          else if (value > 10000) style = { color: colors.success.low };
          return (
            <span style={style}>
              $
              {value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

const HEADERS = getHeaders();

export default function SalesDemo(props: { height?: string | number | null; theme?: Theme }) {
  const [rows, setRows] = createSignal<SalesRow[]>(salesSampleRows.map((r) => ({ ...r })));
  const [isMobile, setIsMobile] = createSignal(false);

  createEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    onCleanup(() => window.removeEventListener("resize", check));
  });

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setRows((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item)),
    );
  };

  return (
    <SimpleTable
      autoExpandColumns={!isMobile()}
      columnResizing
      columnReordering
      defaultHeaders={HEADERS}
      editColumns
      height={formatTableHeight(props.height ?? null)}
      initialSortColumn="dealValue"
      initialSortDirection="desc"
      onCellEdit={handleCellEdit}
      rows={rows()}
      selectableCells
      theme={props.theme}
    />
  );
}
