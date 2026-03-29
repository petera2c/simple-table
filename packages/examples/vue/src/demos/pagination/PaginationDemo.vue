<template>
  <SimpleTable
    :default-headers="paginationConfig.headers"
    :height="height ?? 'auto'"
    :is-loading="isLoading"
    :on-next-page="onNextPage"
    :rows="rows"
    :rows-per-page="PAGINATION_ROWS_PER_PAGE"
    :should-paginate="true"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { paginationConfig, paginationData, PAGINATION_ROWS_PER_PAGE } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {});

const rows = ref(paginationData.slice(0, PAGINATION_ROWS_PER_PAGE));
const isLoading = ref(false);

const onNextPage = async (pageIndex: number) => {
  const startIndex = pageIndex * PAGINATION_ROWS_PER_PAGE;
  const endIndex = startIndex + PAGINATION_ROWS_PER_PAGE;

  isLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newPageData = paginationData.slice(startIndex, endIndex);

  if (newPageData.length === 0 || rows.value.length > startIndex) {
    isLoading.value = false;
    return false;
  }

  rows.value = [...rows.value, ...newPageData];
  isLoading.value = false;
  return true;
};
</script>
