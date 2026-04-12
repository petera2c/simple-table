<script setup lang="ts">
import { ref, computed, defineComponent, h } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, HeaderObject, Row } from "@simple-table/vue";
import { headerRendererConfig } from "./header-renderer.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

type SortDir = "asc" | "desc" | null;
const CYCLE: SortDir[] = ["asc", "desc", null];

const sortAccessor = ref<string | null>(null);
const sortDirection = ref<SortDir>(null);

const sortedData = computed(() => {
  if (!sortAccessor.value || !sortDirection.value) return [...headerRendererConfig.rows];
  const acc = sortAccessor.value;
  const dir = sortDirection.value;
  return [...headerRendererConfig.rows].sort((a, b) => {
    const aVal = a[acc];
    const bVal = b[acc];
    if (aVal === bVal) return 0;
    const cmp =
      typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
    return dir === "asc" ? cmp : -cmp;
  });
});

function makeSortableHeader(col: HeaderObject) {
  return defineComponent({
    name: `SortHeader-${String(col.accessor)}`,
    setup() {
      return () => {
        const isSorted = sortAccessor.value === col.accessor;
        const dir = isSorted ? sortDirection.value : null;
        const indicator = dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "";
        const handleClick = () => {
          if (!isSorted) {
            sortAccessor.value = col.accessor as string;
            sortDirection.value = "asc";
            return;
          }
          const idx = CYCLE.indexOf(dir);
          const next = CYCLE[(idx + 1) % CYCLE.length];
          if (next) {
            sortAccessor.value = col.accessor as string;
            sortDirection.value = next;
          } else {
            sortAccessor.value = null;
            sortDirection.value = null;
          }
        };
        return h(
          "div",
          {
            onClick: handleClick,
            style: {
              cursor: "pointer",
              userSelect: "none",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            },
          },
          [
            h("span", col.label as string),
            indicator
              ? h("span", { style: { fontSize: "10px", color: "#6366f1" } }, indicator)
              : null,
          ],
        );
      };
    },
  });
}

const headers = computed(() =>
  headerRendererConfig.headers.map((col) => ({
    ...col,
    isSortable: false,
    headerRenderer: makeSortableHeader(col),
  })),
);
</script>

<template>
  <SimpleTable
    :default-headers="headers"
    :rows="sortedData as Row[]"
    :height="props.height"
    :theme="props.theme"
  />
</template>
