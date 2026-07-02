<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteHeaderObject, CellRenderer } from "@simple-table/svelte";
  import { musicData, musicHeaders } from "./music.demo-data";
  import "@simple-table/svelte/styles.css";
  import "./music-theme.css";
  import MusicArtistCell from "./MusicArtistCell.svelte";
  import MusicArtistTypeCell from "./MusicArtistTypeCell.svelte";
  import MusicFollowersCell from "./MusicFollowersCell.svelte";
  import MusicPlaylistReachCell from "./MusicPlaylistReachCell.svelte";
  import MusicPlaylistCountCell from "./MusicPlaylistCountCell.svelte";
  import MusicMonthlyListenersCell from "./MusicMonthlyListenersCell.svelte";
  import MusicPopularityCell from "./MusicPopularityCell.svelte";
  import MusicConversionRateCell from "./MusicConversionRateCell.svelte";
  import MusicRatioCell from "./MusicRatioCell.svelte";
  import MusicGrowthMetricCell from "./MusicGrowthMetricCell.svelte";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const renderers: Record<string, unknown> = {
    artistName: MusicArtistCell,
    artistType: MusicArtistTypeCell,
    followers: MusicFollowersCell,
    followers7DayGrowth: MusicGrowthMetricCell,
    followers28DayGrowth: MusicGrowthMetricCell,
    followers60DayGrowth: MusicGrowthMetricCell,
    popularity: MusicPopularityCell,
    playlistReach: MusicPlaylistReachCell,
    playlistReach7DayGrowth: MusicGrowthMetricCell,
    playlistReach28DayGrowth: MusicGrowthMetricCell,
    playlistReach60DayGrowth: MusicGrowthMetricCell,
    playlistCount: MusicPlaylistCountCell,
    playlistCount7DayGrowth: MusicGrowthMetricCell,
    playlistCount28DayGrowth: MusicGrowthMetricCell,
    playlistCount60DayGrowth: MusicGrowthMetricCell,
    monthlyListeners: MusicMonthlyListenersCell,
    monthlyListeners7DayGrowth: MusicGrowthMetricCell,
    monthlyListeners28DayGrowth: MusicGrowthMetricCell,
    monthlyListeners60DayGrowth: MusicGrowthMetricCell,
    conversionRate: MusicConversionRateCell,
    reachFollowersRatio: MusicRatioCell,
  };

  function applyMusicCellRenderers(hdrs: SvelteHeaderObject[]): SvelteHeaderObject[] {
    return hdrs.map((h) => {
      const acc = String(h.accessor);
      const next: SvelteHeaderObject = { ...h };
      if (acc === "rank") next.pinned = "left";
      if (acc === "artistName") next.pinned = "left";
      const R = renderers[acc];
      if (R) next.cellRenderer = R as CellRenderer;
      if (h.children) next.children = applyMusicCellRenderers(h.children as SvelteHeaderObject[]);
      return next;
    });
  }

  const headers = $derived(
    applyMusicCellRenderers(JSON.parse(JSON.stringify(musicHeaders)) as SvelteHeaderObject[]),
  );
</script>

<div class="music-theme-container" style="font-family: Inter">
  <SimpleTable
    defaultHeaders={headers}
    rows={[...musicData]}
    {height}
    {theme}
    selectableCells={true}
    columnReordering={true}
    columnResizing={true}
    customTheme={{ headerHeight: 30, rowHeight: 85 }}
  />
</div>
