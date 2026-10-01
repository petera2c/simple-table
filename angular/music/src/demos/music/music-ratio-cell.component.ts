import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";

@Component({
  standalone: true,
  selector: "demo-music-ratio",
  template: `<span [style.color]="c.gray">{{ row.reachFollowersRatio.toFixed(1) }}x</span>`,
})
export class MusicRatioCellComponent {
  @Input({ required: true }) row!: MusicArtist;
  @Input() theme?: Theme;

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }
}
