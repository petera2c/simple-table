<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, HeaderObject, CellRenderer, CellChangeProps } from "@simple-table/vue";
import { hrConfig, getHRThemeColors, HR_STATUS_COLOR_MAP } from "@simple-table/examples-shared";
import type { HREmployee } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
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

const renderers: Record<string, CellRenderer> = {
  fullName: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    const c = getHRThemeColors(theme);
    const initials = `${d.firstName?.charAt(0) || ""}${d.lastName?.charAt(0) || ""}`;

    const avatar = el("div", {
      width: "24px", height: "24px", borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: c.avatarBg, color: c.avatarText, fontSize: "12px",
    }, [initials]);

    const info = el("div", { marginLeft: "8px" }, [
      el("div", {}, [d.fullName]),
      el("div", { fontSize: "12px", color: c.grayMuted }, [d.position]),
    ]);

    return el("div", { display: "flex", alignItems: "center" }, [avatar, info]);
  },

  performanceScore: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    const score = d.performanceScore;
    const c = getHRThemeColors(theme);
    const color = score >= 90 ? c.progressSuccess : score >= 65 ? c.progressNormal : c.progressException;

    const track = el("div", {
      backgroundColor: c.progressBg, height: "6px", width: "100%",
      borderRadius: "100px", overflow: "hidden",
    });
    track.appendChild(el("div", {
      height: "100%", width: `${score}%`, backgroundColor: color, borderRadius: "100px",
    }));

    const label = el("div", {
      fontSize: "12px", textAlign: "center", marginTop: "4px", color: c.gray,
    }, [`${score}/100`]);

    return el("div", { width: "100%", display: "flex", flexDirection: "column" }, [track, label]);
  },

  hireDate: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    if (!d.hireDate) return "";
    const [year, month, day] = d.hireDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const c = getHRThemeColors(theme);
    return el("span", { color: c.gray }, [
      date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    ]);
  },

  yearsOfService: ({ row, theme }) => {
    if (row.yearsOfService === null) return "";
    const c = getHRThemeColors(theme);
    return el("span", { color: c.gray }, [`${row.yearsOfService} yrs`]);
  },

  salary: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    const c = getHRThemeColors(theme);
    return el("span", { color: c.gray }, [`$${d.salary.toLocaleString()}`]);
  },

  status: ({ row, theme }) => {
    const d = row as unknown as HREmployee;
    if (!d.status) return "";
    const c = getHRThemeColors(theme);
    const colorKey = HR_STATUS_COLOR_MAP[d.status] || "default";
    const tagColors = c.tagColors[colorKey] || c.tagColors.default;
    return el("span", {
      backgroundColor: tagColors.bg, color: tagColors.text,
      padding: "0 7px", fontSize: "12px", lineHeight: "20px",
      borderRadius: "2px", display: "inline-block",
    }, [d.status]);
  },
};

const headers: HeaderObject[] = hrConfig.headers.map((h) => {
  const renderer = renderers[h.accessor as string];
  return renderer ? { ...h, cellRenderer: renderer } : { ...h };
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
    :height="height"
    :theme="theme"
    :column-reordering="true"
    :column-resizing="true"
    :selectable-cells="true"
    :should-paginate="true"
    :rows-per-page="rowsPerPage"
    :custom-theme="{ rowHeight }"
    @cell-edit="handleCellEdit"
  />
</template>
