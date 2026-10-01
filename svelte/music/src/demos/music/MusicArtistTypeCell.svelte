<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getMusicThemeColors } from "./music.demo-data";
  import type { MusicArtist } from "./music.demo-data";

  let { row, theme }: CellRendererProps<MusicArtist> = $props();
  const c = $derived(getMusicThemeColors(theme));
</script>

<div style="display:flex;flex-direction:column;gap:4px;">
  <div style="font-size:13px;color:{c.gray};">{row.artistType}, {row.pronouns}</div>
  <div style="font-size:12px;color:{c.gray};">{row.recordLabel}</div>
  <div style="font-size:12px;color:{c.gray};">Lyrics Language: {row.lyricsLanguage}</div>
</div>
