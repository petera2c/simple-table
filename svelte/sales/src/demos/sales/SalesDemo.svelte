<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, HeaderObject, CellRenderer, CellChangeProps, Row } from "@simple-table/svelte";
  import { salesConfig, getSalesThemeColors } from "./sales.demo-data";
  import type { SalesRow } from "./sales.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let data = $state(salesConfig.rows.map((r) => ({ ...r })) as Row[]);

  function el(tag: string, styles?: Partial<CSSStyleDeclaration>, children?: (Node | string)[]): HTMLElement {
    const e = document.createElement(tag);
    if (styles) Object.assign(e.style, styles);
    if (children) {
      for (const c of children) {
        e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      }
    }
    return e;
  }

  function buildSalesRenderers(): Record<string, CellRenderer> {
    return {
      dealValue: ({ row, theme: cellTheme }) => {
        if (row.dealValue === "—") return "—";
        const d = row as unknown as SalesRow;
        const c = getSalesThemeColors(cellTheme);
        let color = c.gray;
        let fontWeight = "normal";
        if (d.dealValue > 100000) { color = c.successHigh.color; fontWeight = c.successHigh.fontWeight; }
        else if (d.dealValue > 50000) color = c.successMedium;
        else if (d.dealValue > 10000) color = c.successLow;
        return el("span", { color, fontWeight }, [
          `$${d.dealValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        ]);
      },

      isWon: ({ row }) => {
        if (row.isWon === "—") return "—";
        const d = row as unknown as SalesRow;
        const isWon = d.isWon;
        const s = isWon ? { bg: "#f6ffed", text: "#2a6a0d" } : { bg: "#fff1f0", text: "#a8071a" };
        return el("span", {
          backgroundColor: s.bg, color: s.text,
          padding: "0 7px", fontSize: "12px", lineHeight: "20px",
          borderRadius: "2px", display: "inline-block",
        }, [isWon ? "Won" : "Lost"]);
      },

      commission: ({ row, theme: cellTheme }) => {
        if (row.commission === "—") return "—";
        const d = row as unknown as SalesRow;
        const value = d.commission;
        const c = getSalesThemeColors(cellTheme);
        if (value === 0) return el("span", { color: c.grayMuted }, ["$0.00"]);
        return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },

      profitMargin: ({ row, theme: cellTheme }) => {
        if (row.profitMargin === "—") return "—";
        const d = row as unknown as SalesRow;
        const c = getSalesThemeColors(cellTheme);
        let color = c.gray;
        let fontWeight = "normal";
        if (d.profitMargin >= 0.7) { color = c.successHigh.color; fontWeight = c.successHigh.fontWeight; }
        else if (d.profitMargin >= 0.5) color = c.successMedium;
        else if (d.profitMargin >= 0.4) color = c.successLow;
        else if (d.profitMargin >= 0.3) color = c.info;
        else color = c.warning;
        const barColor = d.profitMargin >= 0.5 ? c.progressHigh : d.profitMargin >= 0.3 ? c.progressMedium : c.progressLow;

        const pctSpan = el("span", { color, fontWeight }, [`${(d.profitMargin * 100).toFixed(1)}%`]);
        const track = el("div", {
          backgroundColor: "#f5f5f5", height: "6px", width: "100%",
          borderRadius: "100px", overflow: "hidden",
        });
        track.appendChild(el("div", {
          height: "100%", width: `${d.profitMargin * 100}%`,
          backgroundColor: barColor, borderRadius: "100px",
        }));
        const barWrap = el("div", { marginLeft: "8px", width: "48px" }, [track]);

        return el("div", { display: "flex", alignItems: "center", justifyContent: "flex-end" }, [pctSpan, barWrap]);
      },

      dealProfit: ({ row, theme: cellTheme }) => {
        if (row.dealProfit === "—") return "—";
        const d = row as unknown as SalesRow;
        const c = getSalesThemeColors(cellTheme);
        if (d.dealProfit === 0) return el("span", { color: c.grayMuted }, ["$0.00"]);
        let color = c.gray;
        let fontWeight = "normal";
        if (d.dealProfit > 50000) { color = c.successHigh.color; fontWeight = c.successHigh.fontWeight; }
        else if (d.dealProfit > 20000) color = c.successMedium;
        else if (d.dealProfit > 10000) color = c.successLow;
        return el("span", { color, fontWeight }, [
          `$${d.dealProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        ]);
      },
    };
  }

  function buildSalesHeaders(): HeaderObject[] {
    const renderers = buildSalesRenderers();
    const headers: HeaderObject[] = JSON.parse(JSON.stringify(salesConfig.headers));

    const applyRenderers = (hdrs: HeaderObject[]) => {
      for (const h of hdrs) {
        const renderer = renderers[h.accessor as string];
        if (renderer) h.cellRenderer = renderer;
        if (h.children) applyRenderers(h.children as HeaderObject[]);
      }
    };
    applyRenderers(headers);
    return headers;
  }

  function handleCellEdit({ accessor, newValue, row }: CellChangeProps) {
    data = data.map((item) => item.id === row.id ? { ...item, [accessor]: newValue } : item) as Row[];
  }
</script>

<SimpleTable
  defaultHeaders={buildSalesHeaders()}
  rows={data}
  {height}
  {theme}
  autoExpandColumns={true}
  editColumns={true}
  selectableCells={true}
  columnResizing={true}
  columnReordering={true}
  initialSortColumn="dealValue"
  initialSortDirection="desc"
  onCellEdit={handleCellEdit}
/>
