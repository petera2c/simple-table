import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularCellRenderer, AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { musicData, musicHeaders } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import { MusicArtistCellComponent } from "./music-artist-cell.component";
import { MusicArtistTypeCellComponent } from "./music-artist-type-cell.component";
import { MusicConversionRateCellComponent } from "./music-conversion-rate-cell.component";
import { MusicFollowersCellComponent } from "./music-followers-cell.component";
import { MusicGrowthMetricCellComponent } from "./music-growth-metric-cell.component";
import { MusicMonthlyListenersCellComponent } from "./music-monthly-listeners-cell.component";
import { MusicPlaylistCountCellComponent } from "./music-playlist-count-cell.component";
import { MusicPlaylistReachCellComponent } from "./music-playlist-reach-cell.component";
import { MusicPopularityCellComponent } from "./music-popularity-cell.component";
import { MusicRatioCellComponent } from "./music-ratio-cell.component";
import "@simple-table/angular/styles.css";
import "./music-theme.css";

const RENDERERS: Partial<Record<string, AngularCellRenderer<MusicArtist>>> = {
  artistName: MusicArtistCellComponent,
  artistType: MusicArtistTypeCellComponent,
  followers: MusicFollowersCellComponent,
  followers7DayGrowth: MusicGrowthMetricCellComponent,
  followers28DayGrowth: MusicGrowthMetricCellComponent,
  followers60DayGrowth: MusicGrowthMetricCellComponent,
  popularity: MusicPopularityCellComponent,
  playlistReach: MusicPlaylistReachCellComponent,
  playlistReach7DayGrowth: MusicGrowthMetricCellComponent,
  playlistReach28DayGrowth: MusicGrowthMetricCellComponent,
  playlistReach60DayGrowth: MusicGrowthMetricCellComponent,
  playlistCount: MusicPlaylistCountCellComponent,
  playlistCount7DayGrowth: MusicGrowthMetricCellComponent,
  playlistCount28DayGrowth: MusicGrowthMetricCellComponent,
  playlistCount60DayGrowth: MusicGrowthMetricCellComponent,
  monthlyListeners: MusicMonthlyListenersCellComponent,
  monthlyListeners7DayGrowth: MusicGrowthMetricCellComponent,
  monthlyListeners28DayGrowth: MusicGrowthMetricCellComponent,
  monthlyListeners60DayGrowth: MusicGrowthMetricCellComponent,
  conversionRate: MusicConversionRateCellComponent,
  reachFollowersRatio: MusicRatioCellComponent,
};

function applyMusicCellRenderers(hdrs: readonly AngularColumnDef<MusicArtist>[]): AngularColumnDef<MusicArtist>[] {
  return hdrs.map((h): AngularColumnDef<MusicArtist> => {
    const acc = String(h.accessor);
    const next: AngularColumnDef<MusicArtist> = { ...h };
    const cellRenderer = RENDERERS[acc];
    if (cellRenderer) next.cellRenderer = cellRenderer;
    if (h.children) next.children = applyMusicCellRenderers(h.children);
    return next;
  });
}

@Component({
  selector: "music-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div class="music-theme-container" style="font-family: Inter">
      <simple-table
      [getRowId]="getRowId"
        [columns]="headers"
        [rows]="rows"
        [height]="height"
        [theme]="theme"
        [selectableCells]="true"
        [columnReordering]="true"
        [columnResizing]="true"
        [customTheme]="{ headerHeight: 30, rowHeight: 85 }"
      ></simple-table>
    </div>
  `,
})
export class MusicDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: MusicArtist[] = [...musicData];
  readonly headers: AngularColumnDef<MusicArtist>[] = applyMusicCellRenderers(
    structuredClone(musicHeaders),
  );

  getRowId = ({ row }: GetRowIdParams<MusicArtist>) => row.id;
}
