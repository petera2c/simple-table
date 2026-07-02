import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";

@Component({
  standalone: true,
  selector: "demo-music-ratio",
  template: `<span [style.color]="c.gray">{{ d.reachFollowersRatio.toFixed(1) }}x</span>`,
})
export class MusicRatioCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): MusicArtist {
    return this.row as unknown as MusicArtist;
  }

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }
}
