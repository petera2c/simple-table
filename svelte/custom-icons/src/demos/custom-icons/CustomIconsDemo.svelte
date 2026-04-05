<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { customIconsConfig, buildVanillaCustomIcons } from "./custom-icons.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const icons = buildVanillaCustomIcons();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(customIconsConfig.headers)}
  rows={customIconsConfig.rows}
  {icons}
  {height}
  {theme}
/>
