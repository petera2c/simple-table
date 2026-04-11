<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { themesConfig, AVAILABLE_THEMES } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let selectedTheme: Theme = $state(theme ?? "light");
</script>

<div>
  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px">
    {#each AVAILABLE_THEMES as t}
      <button
        onclick={() => (selectedTheme = t.value)}
        style="padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; border: {selectedTheme === t.value ? '2px solid #3b82f6' : '1px solid #d1d5db'}; background: {selectedTheme === t.value ? '#eff6ff' : '#fff'}; color: {selectedTheme === t.value ? '#1d4ed8' : '#374151'}; font-weight: {selectedTheme === t.value ? 600 : 400}"
      >
        {t.label}
      </button>
    {/each}
  </div>
  <SimpleTable
    defaultHeaders={themesConfig.headers}
    rows={themesConfig.rows}
    {height}
    theme={selectedTheme}
  />
</div>
