<script setup lang="ts">
import { ref, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import type { HeaderObject, Row } from "simple-table-core";
import { headerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

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
    const cmp = typeof aVal === "number" && typeof bVal === "number"
      ? aVal - bVal
      : String(aVal).localeCompare(String(bVal));
    return dir === "asc" ? cmp : -cmp;
  });
});

function buildHeaderRenderer(h: HeaderObject) {
  return () => {
    const isSorted = sortAccessor.value === h.accessor;
    const dir = isSorted ? sortDirection.value : null;
    const indicator = dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "";

    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      cursor: "pointer",
      userSelect: "none",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    });
    wrapper.addEventListener("click", () => {
      if (!isSorted) {
        sortAccessor.value = h.accessor as string;
        sortDirection.value = "asc";
        return;
      }
      const idx = CYCLE.indexOf(dir);
      const next = CYCLE[(idx + 1) % CYCLE.length];
      if (next) {
        sortAccessor.value = h.accessor as string;
        sortDirection.value = next;
      } else {
        sortAccessor.value = null;
        sortDirection.value = null;
      }
    });

    const label = document.createElement("span");
    label.textContent = h.label;
    wrapper.appendChild(label);

    if (indicator) {
      const ind = document.createElement("span");
      Object.assign(ind.style, { fontSize: "10px", color: "#6366f1" });
      ind.textContent = indicator;
      wrapper.appendChild(ind);
    }

    return wrapper;
  };
}

const headers = computed(() =>
  headerRendererConfig.headers.map((h) => ({
    ...h,
    isSortable: false,
    headerRenderer: buildHeaderRenderer(h),
  }))
);
</script>

<template>
  <SimpleTable
    :default-headers="headers"
    :rows="sortedData"
    :height="props.height"
    :theme="props.theme"
  />
</template>
