<script setup lang="ts">
import { h } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, HeaderObject, CellRendererProps } from "@simple-table/vue";
import { manufacturingConfig, getManufacturingStatusColors } from "./manufacturing.demo-data";
import type { ManufacturingRow } from "./manufacturing.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

function getHeaders(): HeaderObject[] {
  return manufacturingConfig.headers.map((col) => {
    if (col.accessor === "productLine") {
      return {
        ...col,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          return d.stations
            ? h("span", { style: { fontWeight: "bold" } }, d.productLine)
            : d.productLine;
        },
      };
    }
    if (col.accessor === "station") {
      return {
        ...col,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations) return h("span", { style: { color: "#6b7280" } }, d.id);
          return h("div", { style: { display: "flex", alignItems: "center", gap: "4px" } }, [
            h(
              "span",
              {
                style: {
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  padding: "2px 6px",
                  borderRadius: "4px",
                },
              },
              d.id,
            ),
            h("span", d.station),
          ]);
        },
      };
    }
    if (col.accessor === "status") {
      return {
        ...col,
        cellRenderer: ({ row: r, theme }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations) return "—";
          const colors = getManufacturingStatusColors(d.status, theme);
          return h(
            "span",
            {
              style: {
                backgroundColor: colors.bg,
                color: colors.text,
                padding: "4px 12px",
                fontSize: "12px",
                lineHeight: "20px",
                borderRadius: "4px",
                display: "inline-block",
                fontWeight: "600",
              },
            },
            d.status,
          );
        },
      };
    }
    if (col.accessor === "outputRate" || col.accessor === "defectCount" || col.accessor === "energy") {
      return {
        ...col,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          const value = d[col.accessor as keyof ManufacturingRow] as number;
          return h("div", { style: d.stations ? { fontWeight: "bold" } : {} }, value.toLocaleString());
        },
      };
    }
    if (col.accessor === "cycletime") {
      return {
        ...col,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations)
            return h("span", { style: { fontWeight: "bold" } }, d.cycletime.toFixed(1));
          return h("span", String(d.cycletime));
        },
      };
    }
    if (col.accessor === "efficiency") {
      return {
        ...col,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          const color = d.efficiency >= 90 ? "#52c41a" : d.efficiency >= 75 ? "#1890ff" : "#ff4d4f";
          return h("div", { style: { width: "100%", display: "flex", flexDirection: "column" } }, [
            h(
              "div",
              {
                style: {
                  backgroundColor: "#f5f5f5",
                  height: "6px",
                  width: "100%",
                  borderRadius: "100px",
                  overflow: "hidden",
                },
              },
              [
                h("div", {
                  style: {
                    height: "100%",
                    width: `${d.efficiency}%`,
                    backgroundColor: color,
                    borderRadius: "100px",
                  },
                }),
              ],
            ),
            h(
              "div",
              {
                style: {
                  fontSize: "12px",
                  textAlign: "center",
                  marginTop: "4px",
                  fontWeight: d.stations ? "bold" : "normal",
                },
              },
              `${d.efficiency}%`,
            ),
          ]);
        },
      };
    }
    if (col.accessor === "defectRate") {
      return {
        ...col,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          const color = d.defectRate < 1 ? "#16a34a" : d.defectRate < 3 ? "#f59e0b" : "#dc2626";
          return h(
            "span",
            { style: { color, fontWeight: d.stations ? "bold" : "normal" } },
            `${d.defectRate.toFixed(2)}%`,
          );
        },
      };
    }
    if (col.accessor === "downtime") {
      return {
        ...col,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          const color = d.downtime < 1 ? "#16a34a" : d.downtime < 2 ? "#f59e0b" : "#dc2626";
          return h(
            "span",
            { style: { color, fontWeight: d.stations ? "bold" : "normal" } },
            d.downtime.toFixed(2),
          );
        },
      };
    }
    if (col.accessor === "utilization") {
      return {
        ...col,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations)
            return h("span", { style: { fontWeight: "bold" } }, `${d.utilization.toFixed(0)}%`);
          return `${d.utilization}%`;
        },
      };
    }
    if (col.accessor === "maintenanceDate") {
      return {
        ...col,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations) return "—";
          const [year, month, day] = d.maintenanceDate.split("-").map(Number);
          const date = new Date(year, month - 1, day);
          const today = new Date();
          const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          let tagColor = "#e6f7ff";
          let textColor = "#0050b3";
          if (diffDays <= 3) {
            tagColor = "#fff1f0";
            textColor = "#a8071a";
          } else if (diffDays <= 7) {
            tagColor = "#fff7e6";
            textColor = "#ad4e00";
          }
          return h(
            "span",
            {
              style: {
                backgroundColor: tagColor,
                color: textColor,
                padding: "0 7px",
                fontSize: "12px",
                lineHeight: "20px",
                borderRadius: "2px",
                display: "inline-block",
              },
            },
            `${date.toLocaleDateString()} (${diffDays} days)`,
          );
        },
      };
    }
    return col;
  });
}

const headers = getHeaders();
</script>

<template>
  <SimpleTable
    :default-headers="headers"
    :rows="manufacturingConfig.rows"
    :height="props.height"
    :theme="props.theme"
    :column-resizing="true"
    :column-reordering="true"
    :selectable-cells="true"
    :row-grouping="['stations']"
  />
</template>
