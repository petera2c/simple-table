import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import { MusicTagComponent } from "./music-tag.component";

@Component({
  standalone: true,
  selector: "demo-music-playlist-count",
  imports: [MusicTagComponent],
  template: `
    <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start;">
      <div style="font-size:14px;" [style.color]="c.gray">{{ d.playlistCount.toLocaleString() }}</div>
      <demo-music-tag [text]="tagText" variant="green" [theme]="theme" />
    </div>
  `,
})
export class MusicPlaylistCountCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): MusicArtist {
    return this.row as unknown as MusicArtist;
  }

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }

  get tagText(): string {
    return `↑ +${this.d.playlistCountGrowth} (${this.d.playlistCountGrowthPercent.toFixed(2)}%)`;
  }
}
