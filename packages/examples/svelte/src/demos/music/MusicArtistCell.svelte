<script lang="ts">
  import type { CellRendererProps } from "@simple-table/svelte";
  import { getMusicThemeColors } from "./music.demo-data";
  import type { MusicArtist } from "./music.demo-data";
  import MusicTag from "./MusicTag.svelte";

  let { row, theme }: CellRendererProps = $props();
  const d = $derived(row as unknown as MusicArtist);
  const c = $derived(getMusicThemeColors(theme));

  const avatarStyle = $derived.by(() => {
    let hash = 0;
    for (let i = 0; i < d.artistName.length; i++) {
      hash = d.artistName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `width:40px;height:40px;border-radius:50%;background-color:hsl(${hash % 360}, 65%, 55%);display:flex;align-items:center;justify-content:center;color:white;font-size:16px;flex-shrink:0;`;
  });
</script>

<div style="display:flex;align-items:center;gap:12px;">
  <div style={avatarStyle}>{d.artistName.charAt(0).toUpperCase()}</div>
  <div style="display:flex;flex-direction:column;gap:6px;flex:1;">
    <span style="font-weight:500;font-size:14px;color:{c.gray};">{d.artistName}</span>
    <div style="display:flex;gap:6px;flex-wrap:wrap;">
      <MusicTag text={d.growthStatus} variant="default" c={c} />
      <MusicTag text={d.mood} variant="default" c={c} />
      <MusicTag text={d.genre} variant="default" c={c} />
    </div>
  </div>
</div>
