<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { customIconsConfig, buildVanillaCustomIcons } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const icons = buildVanillaCustomIcons();
</script>

<SimpleTable
  defaultHeaders={customIconsConfig.headers}
  rows={customIconsConfig.rows}
  {icons}
  {height}
  {theme}
/>
