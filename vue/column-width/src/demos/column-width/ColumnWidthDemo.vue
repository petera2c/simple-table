<template>
  <SimpleTable
    :auto-expand-columns="!isMobile"
    :column-resizing="true"
    :default-headers="defaultHeadersFromCore(columnWidthConfig.headers)"
    :height="height"
    :rows="columnWidthConfig.rows"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnWidthConfig } from "./column-width.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const isMobile = ref(false);

function checkMobile() {
  isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>
