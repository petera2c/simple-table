import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";

@Component({
  standalone: true,
  selector: "demo-music-conversion-rate",
  template: `<span [style.color]="c.gray">{{ row.conversionRate.toFixed(2) }}%</span>`,
})
export class MusicConversionRateCellComponent {
  @Input({ required: true }) row!: MusicArtist;
  @Input() theme?: Theme;

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }
}
