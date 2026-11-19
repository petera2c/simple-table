import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getMusicThemeColors, musicNumber } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import { MusicTagComponent } from "./music-tag.component";

@Component({
  standalone: true,
  selector: "demo-music-playlist-reach",
  imports: [MusicTagComponent],
  template: `
    <div style="display:flex;flex-direction:column;gap:4px;">
      <div style="font-size:14px;" [style.color]="c.gray">{{ row.playlistReachFormatted }}</div>
      <demo-music-tag [text]="tagText" [variant]="isPos ? 'green' : 'red'" [theme]="theme" />
    </div>
  `,
})
export class MusicPlaylistReachCellComponent {
  @Input({ required: true }) row!: MusicArtist;
  @Input() theme?: Theme;

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }

  get isPos(): boolean {
    return musicNumber(this.row, "playlistReachChange") >= 0;
  }

  get tagText(): string {
    const pct = Math.abs(musicNumber(this.row, "playlistReachChangePercent")).toFixed(2);
    return `${this.isPos ? "↑" : "↓"} ${this.isPos ? "+" : ""}${this.row.playlistReachChangeFormatted} (${pct}%)`;
  }
}
