<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteColumnDef, SvelteCellRenderer, GetRowIdParams } from "@simple-table/svelte";
  import { musicData, musicHeaders } from "./music.demo-data";
  import type { MusicArtist } from "./music.demo-data";
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

  const renderers: Partial<Record<string, SvelteCellRenderer<MusicArtist>>> = {
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

  function applyMusicCellRenderers(hdrs: SvelteColumnDef<MusicArtist>[]): SvelteColumnDef<MusicArtist>[] {
    return hdrs.map((h) => {
      const acc = String(h.accessor);
      const cellRenderer = renderers[acc];
      return {
        ...h,
        ...(acc === "rank" || acc === "artistName" ? { pinned: "left" as const } : {}),
        ...(cellRenderer ? { cellRenderer } : {}),
        ...(h.children ? { children: applyMusicCellRenderers(h.children) } : {}),
      };
    });
  }

  const headers = $derived(applyMusicCellRenderers(musicHeaders));
  const getRowId = ({ row }: GetRowIdParams<MusicArtist>) => row.id;
</script>

<div class="music-theme-container" style="font-family: Inter">
  <SimpleTable
    columns={headers}
    rows={[...musicData]}
    {getRowId}
    {height}
    {theme}
    selectableCells={true}
    columnReordering={true}
    columnResizing={true}
    customTheme={{ headerHeight: 30, rowHeight: 85 }}
  />
</div>
