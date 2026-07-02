<script setup lang="ts">
import { ref, h, type VNodeChild } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueHeaderObject, CellRendererProps, CellChangeProps } from "@simple-table/vue";
import { hrConfig, getHRThemeColors, HR_STATUS_COLOR_MAP } from "./hr.demo-data";
import type { HREmployee } from "./hr.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

function hv(
  tag: string,
  styles?: Record<string, string | number | undefined>,
  children?: VNodeChild[],
) {
  return h(tag, { style: styles ?? {} }, children ?? []);
}

const renderers: Record<string, (p: CellRendererProps) => VNodeChild> = {
  fullName: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    const c = getHRThemeColors(theme);
    const initials = `${d.firstName?.charAt(0) || ""}${d.lastName?.charAt(0) || ""}`;

    const avatar = hv(
      "div",
      {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: c.avatarBg,
        color: c.avatarText,
        fontSize: "12px",
      },
      [initials],
    );

    const info = hv("div", { marginLeft: "8px" }, [
      hv("div", {}, [d.fullName]),
      hv("div", { fontSize: "12px", color: c.grayMuted }, [d.position]),
    ]);

    return hv("div", { display: "flex", alignItems: "center" }, [avatar, info]);
  },

  performanceScore: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    const score = d.performanceScore;
    const c = getHRThemeColors(theme);
    const color = score >= 90 ? c.progressSuccess : score >= 65 ? c.progressNormal : c.progressException;

    const track = hv(
      "div",
      {
        backgroundColor: c.progressBg,
        height: "6px",
        width: "100%",
        borderRadius: "100px",
        overflow: "hidden",
      },
      [
        hv("div", {
          height: "100%",
          width: `${score}%`,
          backgroundColor: color,
          borderRadius: "100px",
        }),
      ],
    );

    const label = hv(
      "div",
      {
        fontSize: "12px",
        textAlign: "center",
        marginTop: "4px",
        color: c.gray,
      },
      [`${score}/100`],
    );

    return hv("div", { width: "100%", display: "flex", flexDirection: "column" }, [track, label]);
  },

  hireDate: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    if (!d.hireDate) return "";
    const [year, month, day] = d.hireDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const c = getHRThemeColors(theme);
    return hv("span", { color: c.gray }, [
      date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    ]);
  },

  yearsOfService: ({ row, theme }) => {
    if (row.yearsOfService === null) return "";
    const c = getHRThemeColors(theme);
    return hv("span", { color: c.gray }, [`${row.yearsOfService} yrs`]);
  },

  salary: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    const c = getHRThemeColors(theme);
    return hv("span", { color: c.gray }, [`$${d.salary.toLocaleString()}`]);
  },

  status: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    if (!d.status) return "";
    const c = getHRThemeColors(theme);
    const colorKey = HR_STATUS_COLOR_MAP[d.status] || "default";
    const tagColors = c.tagColors[colorKey] || c.tagColors.default;
    return hv(
      "span",
      {
        backgroundColor: tagColors.bg,
        color: tagColors.text,
        padding: "0 7px",
        fontSize: "12px",
        lineHeight: "20px",
        borderRadius: "2px",
        display: "inline-block",
      },
      [d.status],
    );
  },
};

const headers: VueHeaderObject[] = hrConfig.headers.map((col) => {
  const renderer = renderers[col.accessor as string];
  return renderer ? { ...col, cellRenderer: renderer } : { ...col };
});

const data = ref([...hrConfig.rows]);
const rowHeight = 48;
const heightNum = typeof props.height === "number" ? props.height : 400;
const rowsPerPage = Math.floor(heightNum / rowHeight);

const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
  data.value = data.value.map((item) =>
    item.id === row.id ? { ...item, [accessor]: newValue } : item,
  );
};
</script>

<template>
  <SimpleTable
    :default-headers="headers"
    :rows="data"
    :height="props.height"
    :theme="props.theme"
    :column-reordering="true"
    :column-resizing="true"
    :selectable-cells="true"
    :should-paginate="true"
    :rows-per-page="rowsPerPage"
    :custom-theme="{ rowHeight }"
    @cell-edit="handleCellEdit"
  />
</template>
