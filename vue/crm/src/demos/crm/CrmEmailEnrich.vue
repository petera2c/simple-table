<script setup lang="ts">
import { ref } from "vue";
type CrmColors = typeof import("./crm.demo-data").CRM_THEME_COLORS_LIGHT;

const props = defineProps<{ colors: CrmColors }>();

const isLoading = ref(false);
const email = ref<string | null>(null);

function handleClick() {
  if (isLoading.value || email.value) return;
  isLoading.value = true;
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "company.com"];
  const names = ["john", "jane", "mike", "sarah", "david", "lisa", "chris", "emma"];
  setTimeout(() => {
    email.value = `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 999) + 1}@${domains[Math.floor(Math.random() * domains.length)]}`;
    isLoading.value = false;
  }, 2000);
}
</script>

<template>
  <span
    v-if="email"
    style="
      margin-right: 8px;
      display: inline-flex;
      cursor: default;
      align-items: center;
      column-gap: 6px;
      border-radius: 9999px;
      background-color: var(--crm-tag-bg, transparent);
      padding-inline: 8px;
      padding-block: 4px;
      font-size: 12px;
      font-weight: 500;
    "
    :style="{ backgroundColor: colors.tagBg, color: colors.tagText }"
  >
    {{ email }}
  </span>
  <span
    v-else-if="isLoading"
    style="
      margin-right: 8px;
      display: inline-flex;
      cursor: default;
      align-items: center;
      column-gap: 6px;
      border-radius: 9999px;
      padding-inline: 8px;
      padding-block: 4px;
      font-size: 12px;
      font-weight: 500;
    "
    :style="{ backgroundColor: colors.tagBg, color: colors.tagText }"
  >
    <div
      :style="{
        width: '12px',
        height: '12px',
        border: `2px solid ${colors.buttonHoverBg}`,
        borderTop: `2px solid ${colors.accent}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }"
    />
    Enriching...
  </span>
  <span
    v-else
    style="
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      column-gap: 6px;
      border-radius: 9999px;
      padding-inline: 8px;
      padding-block: 4px;
      font-size: 12px;
      font-weight: 500;
      background-color: color-mix(in oklab, oklch(62.3% 0.214 259.815) 10%, transparent);
    "
    :style="{ color: colors.tagText }"
    @click="handleClick"
  >
    Enrich
  </span>
</template>
