<script setup lang="ts">
import { ref } from "vue";
type CrmColors = typeof import("./crm.demo-data").CRM_THEME_COLORS_LIGHT;

const props = defineProps<{ colors: CrmColors }>();

const selected = ref<string | null>(null);

const btnStyle = {
  flex: 1,
  padding: "4px 8px",
  fontSize: "0.75rem",
  fontWeight: "500",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s",
} as const;
</script>

<template>
  <div style="display: flex; align-items: center">
    <button
      :style="{
        ...btnStyle,
        color: props.colors.buttonText,
        backgroundColor: selected === 'fit' ? 'oklch(62.7% 0.194 149.214)' : 'oklch(92.5% 0.084 155.995)',
        borderTopLeftRadius: '6px',
        borderBottomLeftRadius: '6px',
      }"
      @click="selected = selected === 'fit' ? null : 'fit'"
    >
      ✓
    </button>
    <button
      :style="{
        ...btnStyle,
        color: props.colors.buttonText,
        backgroundColor: selected === 'partial' ? props.colors.buttonHoverBg : props.colors.buttonBg,
      }"
      @click="selected = selected === 'partial' ? null : 'partial'"
    >
      ?
    </button>
    <button
      :style="{
        ...btnStyle,
        color: props.colors.buttonText,
        backgroundColor: selected === 'no' ? 'oklch(64.6% 0.222 41.116)' : 'oklch(90.1% 0.076 70.697)',
        borderTopRightRadius: '6px',
        borderBottomRightRadius: '6px',
      }"
      @click="selected = selected === 'no' ? null : 'no'"
    >
      X
    </button>
  </div>
</template>
