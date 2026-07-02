import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import { MusicTagComponent } from "./music-tag.component";

@Component({
  standalone: true,
  selector: "demo-music-popularity",
  imports: [MusicTagComponent],
  template: `
    <div style="display:flex;justify-content:center;">
      <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;">
        <span style="font-size:14px;" [style.color]="c.gray">{{ d.popularity }}/100</span>
        <demo-music-tag [text]="tagText" [variant]="isPos ? 'green' : 'red'" [theme]="theme" />
      </div>
    </div>
  `,
})
export class MusicPopularityCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): MusicArtist {
    return this.row as unknown as MusicArtist;
  }

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }

  get isPos(): boolean {
    return this.d.popularityChangePercent >= 0;
  }

  get tagText(): string {
    const arrow = this.isPos ? "↑" : "↓";
    return `${arrow} ${Math.abs(this.d.popularityChangePercent).toFixed(2)}%`;
  }
}
