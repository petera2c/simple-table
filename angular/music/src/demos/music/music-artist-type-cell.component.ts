import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";

@Component({
  standalone: true,
  selector: "demo-music-artist-type",
  template: `
    <div style="display:flex;flex-direction:column;gap:4px;">
      <div style="font-size:13px;" [style.color]="c.gray">{{ row.artistType }}, {{ row.pronouns }}</div>
      <div style="font-size:12px;" [style.color]="c.gray">{{ row.recordLabel }}</div>
      <div style="font-size:12px;" [style.color]="c.gray">Lyrics Language: {{ row.lyricsLanguage }}</div>
    </div>
  `,
})
export class MusicArtistTypeCellComponent {
  @Input({ required: true }) row!: MusicArtist;
  @Input() theme?: Theme;

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }
}
