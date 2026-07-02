<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getMusicThemeColors } from "./music.demo-data";
  import type { MusicArtist } from "./music.demo-data";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as MusicArtist);
  const c = $derived(getMusicThemeColors(theme));
</script>

<span style="color:{c.gray};">{d.conversionRate.toFixed(2)}%</span>
