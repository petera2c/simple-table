<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getMusicThemeColors } from "./music.demo-data";
  import type { MusicArtist } from "./music.demo-data";
  import MusicTag from "./MusicTag.svelte";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as MusicArtist);
  const c = $derived(getMusicThemeColors(theme));
  const tagText = $derived(
    `↑ +${d.playlistCountGrowth} (${d.playlistCountGrowthPercent.toFixed(2)}%)`,
  );
</script>

<div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start;">
  <div style="font-size:14px;color:{c.gray};">{d.playlistCount.toLocaleString()}</div>
  <MusicTag text={tagText} variant="green" c={c} />
</div>
