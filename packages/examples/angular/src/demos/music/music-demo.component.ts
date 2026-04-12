import { Component, Input } from "@angular/core";
import { SimpleTableComponent, asRows } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import { musicData, musicHeaders } from "./music.demo-data";
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

const RENDERERS: Record<string, unknown> = {
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

function applyMusicCellRenderers(hdrs: AngularHeaderObject[]): AngularHeaderObject[] {
  return hdrs.map((h) => {
    const acc = String(h.accessor);
    const next: AngularHeaderObject = { ...h };
    const R = RENDERERS[acc];
    if (R) next.cellRenderer = R as AngularHeaderObject["cellRenderer"];
    if (h.children) next.children = applyMusicCellRenderers(h.children as AngularHeaderObject[]);
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
        [defaultHeaders]="headers"
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

  readonly rows = asRows([...musicData]);
  readonly headers: AngularHeaderObject[] = applyMusicCellRenderers(
    JSON.parse(JSON.stringify(musicHeaders)) as AngularHeaderObject[],
  );
}
