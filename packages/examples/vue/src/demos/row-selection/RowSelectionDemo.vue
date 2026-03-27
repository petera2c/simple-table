<template>
  <div>
    <div style="margin-bottom: 12px">
      Selected rows: <strong>{{ selectedCount }}</strong>
    </div>
    <SimpleTable
      :default-headers="rowSelectionConfig.headers"
      :rows="rowSelectionConfig.rows"
      :enable-row-selection="true"
      :height="height"
      :theme="theme"
      @row-selection-change="handleRowSelectionChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, RowSelectionChangeProps } from "@simple-table/vue";
import { rowSelectionConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const selectedRows = ref<Set<string>>(new Set());

const selectedCount = computed(() => selectedRows.value.size);

function handleRowSelectionChange(props: RowSelectionChangeProps) {
  selectedRows.value = new Set(props.selectedRows);
}
</script>
