import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";

@Component({
  standalone: true,
  selector: "demo-music-artist-type",
  template: `
    <div style="display:flex;flex-direction:column;gap:4px;">
      <div style="font-size:13px;" [style.color]="c.gray">{{ d.artistType }}, {{ d.pronouns }}</div>
      <div style="font-size:12px;" [style.color]="c.gray">{{ d.recordLabel }}</div>
      <div style="font-size:12px;" [style.color]="c.gray">Lyrics Language: {{ d.lyricsLanguage }}</div>
    </div>
  `,
})
export class MusicArtistTypeCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): MusicArtist {
    return this.row as unknown as MusicArtist;
  }

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }
}
