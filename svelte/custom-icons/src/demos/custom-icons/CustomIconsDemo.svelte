<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteIconsConfig } from "@simple-table/svelte";
  import { customIconsConfig } from "./custom-icons.demo-data";
  import IconSortUp from "./icons/IconSortUp.svelte";
  import IconSortDown from "./icons/IconSortDown.svelte";
  import IconFilter from "./icons/IconFilter.svelte";
  import IconExpand from "./icons/IconExpand.svelte";
  import IconNext from "./icons/IconNext.svelte";
  import IconPrev from "./icons/IconPrev.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const icons: SvelteIconsConfig = {
    sortUp: IconSortUp,
    sortDown: IconSortDown,
    filter: IconFilter,
    expand: IconExpand,
    next: IconNext,
    prev: IconPrev,
  };
</script>

<SimpleTable
  defaultHeaders={customIconsConfig.headers}
  rows={customIconsConfig.rows}
  {icons}
  {height}
  {theme}
/>
