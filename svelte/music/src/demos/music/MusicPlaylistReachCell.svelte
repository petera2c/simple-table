<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getMusicThemeColors } from "./music.demo-data";
  import type { MusicArtist } from "./music.demo-data";
  import MusicTag from "./MusicTag.svelte";

  let { row, theme }: CellRendererProps<MusicArtist> = $props();
  const c = $derived(getMusicThemeColors(theme));
  const isPos = $derived(row.playlistReachChange >= 0);
  const pct = $derived(Math.abs(row.playlistReachChangePercent).toFixed(2));
  const tagText = $derived(
    `${isPos ? "↑" : "↓"} ${isPos ? "+" : ""}${row.playlistReachChangeFormatted} (${pct}%)`,
  );
</script>

<div style="display:flex;flex-direction:column;gap:4px;">
  <div style="font-size:14px;color:{c.gray};">{row.playlistReachFormatted}</div>
  <MusicTag text={tagText} variant={isPos ? "green" : "red"} c={c} />
</div>
