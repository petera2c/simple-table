import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import { MusicTagComponent } from "./music-tag.component";

@Component({
  standalone: true,
  selector: "demo-music-monthly-listeners",
  imports: [MusicTagComponent],
  template: `
    <div style="display:flex;flex-direction:column;gap:4px;">
      <div style="font-size:14px;" [style.color]="c.gray">{{ d.monthlyListenersFormatted }}</div>
      <demo-music-tag [text]="tagText" [variant]="isPos ? 'green' : 'red'" [theme]="theme" />
    </div>
  `,
})
export class MusicMonthlyListenersCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): MusicArtist {
    return this.row as unknown as MusicArtist;
  }

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }

  get isPos(): boolean {
    return this.d.monthlyListenersChange >= 0;
  }

  get tagText(): string {
    const pct = Math.abs(this.d.monthlyListenersChangePercent).toFixed(2);
    return `${this.isPos ? "↑" : "↓"} ${this.isPos ? "+" : ""}${this.d.monthlyListenersChangeFormatted} (${pct}%)`;
  }
}
