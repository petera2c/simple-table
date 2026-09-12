import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, ColumnDef, CellRenderer, CellChangeProps, GetRowIdParams } from "simple-table-core";
import { getThemeColors, salesHeadersCore, salesSampleRows, type SalesRow } from "./sales.demo-data";
import "simple-table-core/styles.css";

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "70dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

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

function applyRenderers(
  hdrs: ColumnDef<SalesRow>[],
  renderers: Record<string, CellRenderer<SalesRow>>,
): ColumnDef<SalesRow>[] {
  return hdrs.map((col) => {
    const renderer = renderers[String(col.accessor)];
    const clone: ColumnDef<SalesRow> = renderer ? { ...col, cellRenderer: renderer } : { ...col };
    if (col.children) {
      clone.children = applyRenderers(col.children, renderers);
    }
    return clone;
  });
}

const salesRenderers: Record<string, CellRenderer<SalesRow>> = {
  dealValue: ({ row, theme }) => {
    const value = row.dealValue;
    const colors = getThemeColors(theme);
    let color = colors.gray;
    let fontWeight = "normal";
    if (value > 100000) {
      color = colors.success.high.color;
      fontWeight = colors.success.high.fontWeight;
    } else if (value > 50000) color = colors.success.medium;
    else if (value > 10000) color = colors.success.low;
    return el("span", { color, fontWeight }, [
      `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    ]);
  },

  isWon: ({ row }) => {
    const s = row.isWon ? { bg: "#f6ffed", text: "#2a6a0d" } : { bg: "#fff1f0", text: "#a8071a" };
    return el(
      "span",
      {
        backgroundColor: s.bg,
        color: s.text,
        padding: "0 7px",
        fontSize: "12px",
        lineHeight: "20px",
        borderRadius: "2px",
        display: "inline-block",
      },
      [row.isWon ? "Won" : "Lost"],
    );
  },

  commission: ({ row, theme }) => {
    const value = row.commission;
    const colors = getThemeColors(theme);
    if (value === 0) return el("span", { color: colors.grayMuted }, ["$0.00"]);
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  profitMargin: ({ row, theme }) => {
    const value = row.profitMargin;
    const colors = getThemeColors(theme);
    let color = colors.gray;
    let fontWeight = "normal";
    if (value >= 0.7) {
      color = colors.success.high.color;
      fontWeight = colors.success.high.fontWeight;
    } else if (value >= 0.5) color = colors.success.medium;
    else if (value >= 0.4) color = colors.success.low;
    else if (value >= 0.3) color = colors.info;
    else color = colors.warning;
    const barColor =
      value >= 0.5 ? colors.progressColors.high : value >= 0.3 ? colors.progressColors.medium : colors.progressColors.low;

    const pctSpan = el("span", { color, fontWeight }, [`${(value * 100).toFixed(1)}%`]);
    const track = el("div", {
      backgroundColor: "#f5f5f5",
      height: "6px",
      width: "100%",
      borderRadius: "100px",
      overflow: "hidden",
    });
    track.appendChild(
      el("div", {
        height: "100%",
        width: `${value * 100}%`,
        backgroundColor: barColor,
        borderRadius: "100px",
      }),
    );
    const barWrap = el("div", { marginLeft: "8px", width: "48px" }, [track]);

    return el("div", { display: "flex", alignItems: "center", justifyContent: "flex-end" }, [pctSpan, barWrap]);
  },

  dealProfit: ({ row, theme }) => {
    const value = row.dealProfit;
    const colors = getThemeColors(theme);
    if (value === 0) return el("span", { color: colors.grayMuted }, ["$0.00"]);
    let color = colors.gray;
    let fontWeight = "normal";
    if (value > 50000) {
      color = colors.success.high.color;
      fontWeight = colors.success.high.fontWeight;
    } else if (value > 20000) color = colors.success.medium;
    else if (value > 10000) color = colors.success.low;
    return el("span", { color, fontWeight }, [
      `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    ]);
  },
};

const headers = applyRenderers(salesHeadersCore, salesRenderers);
const getRowId = ({ row }: GetRowIdParams<SalesRow>) => row.id;

export function renderSalesDemo(
  container: HTMLElement,
  options?: { height?: string | number | null; theme?: Theme },
): SimpleTableVanilla<SalesRow> {
  let rows: SalesRow[] = salesSampleRows.map((r) => ({ ...r }));
  let isMobile = window.innerWidth < 768;

  let table!: SimpleTableVanilla<SalesRow>;

  const onResize = () => {
    const next = window.innerWidth < 768;
    if (next !== isMobile) {
      isMobile = next;
      table.update({ autoExpandColumns: !isMobile });
    }
  };
  window.addEventListener("resize", onResize);

  table = new SimpleTableVanilla(container, {
    getRowId,
    columns: headers,
    rows,
    height: formatTableHeight(options?.height),
    theme: options?.theme,
    autoExpandColumns: !isMobile,
    enableColumnEditor: true,
    selectableCells: true,
    columnResizing: true,
    columnReordering: true,
    initialSortColumn: "dealValue",
    initialSortDirection: "desc",
    onCellEdit: ({ accessor, newValue, row }: CellChangeProps<SalesRow>) => {
      rows = rows.map((item) =>
        item.id === row.id ? { ...item, [accessor]: newValue } : item,
      );
      table.update({ rows });
    },
  });

  const originalDestroy = table.destroy.bind(table);
  (table as { destroy: () => void }).destroy = () => {
    window.removeEventListener("resize", onResize);
    originalDestroy();
  };

  return table;
}
