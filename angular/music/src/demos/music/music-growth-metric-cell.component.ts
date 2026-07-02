import { Component, Input } from "@angular/core";
import type { Accessor, Row, Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import { MusicTagComponent } from "./music-tag.component";

const CONFIG: Record<
  string,
  { val: keyof MusicArtist; pct: keyof MusicArtist; signed: boolean; align: "left" | "right" }
> = {
  followers7DayGrowth: { val: "followers7DayGrowth", pct: "followers7DayGrowthPercent", signed: false, align: "right" },
  followers28DayGrowth: { val: "followers28DayGrowth", pct: "followers28DayGrowthPercent", signed: false, align: "right" },
  followers60DayGrowth: { val: "followers60DayGrowth", pct: "followers60DayGrowthPercent", signed: false, align: "right" },
  playlistReach7DayGrowth: { val: "playlistReach7DayGrowth", pct: "playlistReach7DayGrowthPercent", signed: true, align: "right" },
  playlistReach28DayGrowth: { val: "playlistReach28DayGrowth", pct: "playlistReach28DayGrowthPercent", signed: true, align: "right" },
  playlistReach60DayGrowth: { val: "playlistReach60DayGrowth", pct: "playlistReach60DayGrowthPercent", signed: true, align: "right" },
  playlistCount7DayGrowth: { val: "playlistCount7DayGrowth", pct: "playlistCount7DayGrowthPercent", signed: false, align: "right" },
  playlistCount28DayGrowth: { val: "playlistCount28DayGrowth", pct: "playlistCount28DayGrowthPercent", signed: false, align: "right" },
  playlistCount60DayGrowth: { val: "playlistCount60DayGrowth", pct: "playlistCount60DayGrowthPercent", signed: false, align: "right" },
  monthlyListeners7DayGrowth: { val: "monthlyListeners7DayGrowth", pct: "monthlyListeners7DayGrowthPercent", signed: true, align: "right" },
  monthlyListeners28DayGrowth: { val: "monthlyListeners28DayGrowth", pct: "monthlyListeners28DayGrowthPercent", signed: true, align: "right" },
  monthlyListeners60DayGrowth: { val: "monthlyListeners60DayGrowth", pct: "monthlyListeners60DayGrowthPercent", signed: true, align: "right" },
};

@Component({
  standalone: true,
  selector: "demo-music-growth-metric",
  imports: [MusicTagComponent],
  template: `
    @if (view) {
      <div
        style="display:flex;flex-direction:column;gap:4px;"
        [style.align-items]="view.align === 'right' ? 'flex-end' : 'flex-start'"
      >
        <span style="font-size:14px;" [style.color]="c.gray">{{ view.line }}</span>
        <demo-music-tag [text]="view.tagText" [variant]="view.variant" [theme]="theme" />
      </div>
    }
  `,
})
export class MusicGrowthMetricCellComponent {
  @Input({ required: true }) row!: Row;
  @Input({ required: true }) accessor!: Accessor;
  @Input() theme?: Theme;

  get d(): MusicArtist {
    return this.row as unknown as MusicArtist;
  }

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }

  get view(): { line: string; tagText: string; variant: "green" | "red"; align: "left" | "right" } | null {
    const cfg = CONFIG[String(this.accessor)];
    if (!cfg) return null;
    const val = Number(this.d[cfg.val]);
    const pct = Number(this.d[cfg.pct]);
    const isPositive = cfg.signed ? val >= 0 : true;
    const displayVal = Number.isFinite(val) ? val.toLocaleString() : String(this.d[cfg.val]);
    const prefix = isPositive ? "+" : "";
    const arrow = isPositive ? "↑" : "↓";
    const tagText = `${arrow} ${Math.abs(pct).toFixed(2)}%`;
    return {
      line: `${prefix}${displayVal}`,
      tagText,
      variant: isPositive ? "green" : "red",
      align: cfg.align,
    };
  }
}
