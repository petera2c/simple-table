<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getMusicThemeColors } from "./music.demo-data";
  import type { MusicArtist } from "./music.demo-data";
  import MusicTag from "./MusicTag.svelte";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as MusicArtist);
  const c = $derived(getMusicThemeColors(theme));
  const isPos = $derived(d.playlistReachChange >= 0);
  const pct = $derived(Math.abs(d.playlistReachChangePercent).toFixed(2));
  const tagText = $derived(
    `${isPos ? "↑" : "↓"} ${isPos ? "+" : ""}${d.playlistReachChangeFormatted} (${pct}%)`,
  );
</script>

<div style="display:flex;flex-direction:column;gap:4px;">
  <div style="font-size:14px;color:{c.gray};">{d.playlistReachFormatted}</div>
  <MusicTag text={tagText} variant={isPos ? "green" : "red"} c={c} />
</div>
