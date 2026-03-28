<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import type { HeaderObject, CellRenderer, CellChangeProps, Row } from "simple-table-core";
import { salesConfig, getSalesThemeColors } from "@simple-table/examples-shared";
import type { SalesRow } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

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

const salesRenderers: Record<string, CellRenderer> = {
  dealValue: ({ row, theme }) => {
    if (row.dealValue === "—") return "—";
    const d = row as unknown as SalesRow;
    const value = d.dealValue;
    const c = getSalesThemeColors(theme);
    let color = c.gray;
    let fontWeight = "normal";
    if (value > 100000) { color = c.successHigh.color; fontWeight = c.successHigh.fontWeight; }
    else if (value > 50000) color = c.successMedium;
    else if (value > 10000) color = c.successLow;
    return el("span", { color, fontWeight }, [
      `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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

  commission: ({ row, theme }) => {
    if (row.commission === "—") return "—";
    const d = row as unknown as SalesRow;
    const value = d.commission;
    const c = getSalesThemeColors(theme);
    if (value === 0) return el("span", { color: c.grayMuted }, ["$0.00"]);
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  profitMargin: ({ row, theme }) => {
    if (row.profitMargin === "—") return "—";
    const d = row as unknown as SalesRow;
    const value = d.profitMargin;
    const c = getSalesThemeColors(theme);
    let color = c.gray;
    let fontWeight = "normal";
    if (value >= 0.7) { color = c.successHigh.color; fontWeight = c.successHigh.fontWeight; }
    else if (value >= 0.5) color = c.successMedium;
    else if (value >= 0.4) color = c.successLow;
    else if (value >= 0.3) color = c.info;
    else color = c.warning;
    const barColor = value >= 0.5 ? c.progressHigh : value >= 0.3 ? c.progressMedium : c.progressLow;

    const pctSpan = el("span", { color, fontWeight }, [`${(value * 100).toFixed(1)}%`]);
    const track = el("div", {
      backgroundColor: "#f5f5f5", height: "6px", width: "100%",
      borderRadius: "100px", overflow: "hidden",
    });
    track.appendChild(el("div", {
      height: "100%", width: `${value * 100}%`,
      backgroundColor: barColor, borderRadius: "100px",
    }));
    const barWrap = el("div", { marginLeft: "8px", width: "48px" }, [track]);

    return el("div", { display: "flex", alignItems: "center", justifyContent: "flex-end" }, [pctSpan, barWrap]);
  },

  dealProfit: ({ row, theme }) => {
    if (row.dealProfit === "—") return "—";
    const d = row as unknown as SalesRow;
    const value = d.dealProfit;
    const c = getSalesThemeColors(theme);
    if (value === 0) return el("span", { color: c.grayMuted }, ["$0.00"]);
    let color = c.gray;
    let fontWeight = "normal";
    if (value > 50000) { color = c.successHigh.color; fontWeight = c.successHigh.fontWeight; }
    else if (value > 20000) color = c.successMedium;
    else if (value > 10000) color = c.successLow;
    return el("span", { color, fontWeight }, [
      `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    ]);
  },
};

function applyRenderers(hdrs: readonly HeaderObject[], map: Record<string, CellRenderer>): HeaderObject[] {
  return hdrs.map((h) => {
    const renderer = map[h.accessor as string];
    const clone: HeaderObject = renderer ? { ...h, cellRenderer: renderer } : { ...h };
    if (h.children) {
      clone.children = applyRenderers(h.children, map);
    }
    return clone;
  });
}

const headers = applyRenderers(salesConfig.headers, salesRenderers);

const data = ref<Row[]>(salesConfig.rows.map((r) => ({ ...r })));

const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
  data.value = data.value.map((item) =>
    item.id === row.id ? { ...item, [accessor]: newValue } : item,
  ) as Row[];
};
</script>

<template>
  <SimpleTable
    :default-headers="headers"
    :rows="data"
    :height="height"
    :theme="theme"
    :auto-expand-columns="true"
    :edit-columns="true"
    :selectable-cells="true"
    :column-resizing="true"
    :column-reordering="true"
    :initial-sort-column="'dealValue'"
    :initial-sort-direction="'desc'"
    @cell-edit="handleCellEdit"
  />
</template>
