<script setup lang="ts">
import { ref, onMounted, onUnmounted, h, type VNodeChild } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, HeaderObject, CellRendererProps, CellChangeProps, Row } from "@simple-table/vue";
import { getThemeColors, salesHeadersCore, salesSampleRows, type SalesRow } from "./sales.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number | null; theme?: Theme }>(), {
  height: undefined,
});

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "70dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

function hv(
  tag: string,
  styles?: Record<string, string | number | undefined>,
  children?: VNodeChild[],
) {
  return h(tag, { style: styles ?? {} }, children ?? []);
}

const salesRenderers: Record<string, (p: CellRendererProps) => VNodeChild> = {
  dealValue: ({ row, theme }) => {
    if (row.dealValue === "—") return "—";
    const value = (row as unknown as SalesRow).dealValue;
    const colors = getThemeColors(theme);
    let color = colors.gray;
    let fontWeight = "normal";
    if (value > 100000) {
      color = colors.success.high.color;
      fontWeight = colors.success.high.fontWeight;
    } else if (value > 50000) color = colors.success.medium;
    else if (value > 10000) color = colors.success.low;
    return hv("span", { color, fontWeight }, [
      `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    ]);
  },

  isWon: ({ row }) => {
    if (row.isWon === "—") return "—";
    const d = row as unknown as SalesRow;
    const s = d.isWon ? { bg: "#f6ffed", text: "#2a6a0d" } : { bg: "#fff1f0", text: "#a8071a" };
    return hv(
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
      [d.isWon ? "Won" : "Lost"],
    );
  },

  commission: ({ row, theme }) => {
    if (row.commission === "—") return "—";
    const value = (row as unknown as SalesRow).commission;
    const colors = getThemeColors(theme);
    if (value === 0) return hv("span", { color: colors.grayMuted }, ["$0.00"]);
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  profitMargin: ({ row, theme }) => {
    if (row.profitMargin === "—") return "—";
    const value = (row as unknown as SalesRow).profitMargin;
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

    const pctSpan = hv("span", { color, fontWeight }, [`${(value * 100).toFixed(1)}%`]);
    const track = hv(
      "div",
      {
        backgroundColor: "#f5f5f5",
        height: "6px",
        width: "100%",
        borderRadius: "100px",
        overflow: "hidden",
      },
      [
        hv("div", {
          height: "100%",
          width: `${value * 100}%`,
          backgroundColor: barColor,
          borderRadius: "100px",
        }),
      ],
    );
    const barWrap = hv("div", { marginLeft: "8px", width: "48px" }, [track]);

    return hv("div", { display: "flex", alignItems: "center", justifyContent: "flex-end" }, [pctSpan, barWrap]);
  },

  dealProfit: ({ row, theme }) => {
    if (row.dealProfit === "—") return "—";
    const value = (row as unknown as SalesRow).dealProfit;
    const colors = getThemeColors(theme);
    if (value === 0) return hv("span", { color: colors.grayMuted }, ["$0.00"]);
    let color = colors.gray;
    let fontWeight = "normal";
    if (value > 50000) {
      color = colors.success.high.color;
      fontWeight = colors.success.high.fontWeight;
    } else if (value > 20000) color = colors.success.medium;
    else if (value > 10000) color = colors.success.low;
    return hv("span", { color, fontWeight }, [
      `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    ]);
  },
};

function applyRenderers(
  hdrs: readonly HeaderObject[],
  map: Record<string, (p: CellRendererProps) => VNodeChild>,
): HeaderObject[] {
  return hdrs.map((h) => {
    const renderer = map[h.accessor as string];
    const clone: HeaderObject = renderer ? { ...h, cellRenderer: renderer } : { ...h };
    if (h.children) {
      clone.children = applyRenderers(h.children, map);
    }
    return clone;
  });
}

const headers = applyRenderers(salesHeadersCore, salesRenderers);

const data = ref<Row[]>((salesSampleRows.map((r) => ({ ...r })) as Row[]));
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

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
    :height="formatTableHeight(props.height)"
    :theme="props.theme"
    :auto-expand-columns="!isMobile"
    :edit-columns="true"
    :selectable-cells="true"
    :column-resizing="true"
    :column-reordering="true"
    :initial-sort-column="'dealValue'"
    :initial-sort-direction="'desc'"
    @cell-edit="handleCellEdit"
  />
</template>
