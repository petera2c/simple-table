<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getMusicThemeColors } from "./music.demo-data";
  import type { MusicArtist } from "./music.demo-data";
  import MusicTag from "./MusicTag.svelte";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as MusicArtist);
  const c = $derived(getMusicThemeColors(theme));
  const isPos = $derived(d.popularityChangePercent >= 0);
  const arrow = $derived(isPos ? "↑" : "↓");
  const tagText = $derived(`${arrow} ${Math.abs(d.popularityChangePercent).toFixed(2)}%`);
</script>

<div style="display:flex;justify-content:center;">
  <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;">
    <span style="font-size:14px;color:{c.gray};">{d.popularity}/100</span>
    <MusicTag text={tagText} variant={isPos ? "green" : "red"} c={c} />
  </div>
</div>
