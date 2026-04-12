<script setup lang="ts">
import { h } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueIconsConfig } from "@simple-table/vue";
import { customIconsConfig } from "./custom-icons.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

function iconSvg(pathD: string, color: string, strokeWidth = "2.5") {
  return h(
    "svg",
    {
      width: 14,
      height: 14,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    [h("path", { d: pathD })],
  );
}

const icons: VueIconsConfig = {
  sortUp: iconSvg("M12 19V5M5 12l7-7 7 7", "#6366f1"),
  sortDown: iconSvg("M12 5v14M19 12l-7 7-7-7", "#6366f1"),
  filter: iconSvg("M3 4h18l-7 8.5V18l-4 2V12.5L3 4z", "#8b5cf6", "2"),
  expand: iconSvg("M9 5l7 7-7 7", "#6366f1"),
  next: iconSvg("M9 5l7 7-7 7", "#2563eb"),
  prev: iconSvg("M15 19l-7-7 7-7", "#2563eb"),
};
</script>

<template>
  <SimpleTable
    :default-headers="customIconsConfig.headers"
    :rows="customIconsConfig.rows"
    :icons="icons"
    :height="props.height"
    :theme="props.theme"
  />
</template>
