<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { customIconsConfig, buildVanillaCustomIcons } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const icons = buildVanillaCustomIcons();
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
