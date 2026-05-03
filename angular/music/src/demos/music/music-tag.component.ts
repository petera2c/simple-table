import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";

@Component({
  standalone: true,
  selector: "demo-music-tag",
  template: `
    <span
      [style.background-color]="styles.bg"
      [style.color]="styles.text"
      [style.padding]="'0 7px'"
      [style.font-size]="'11px'"
      [style.line-height]="'20px'"
      [style.border-radius]="'4px'"
      [style.display]="'inline-block'"
      [style.border]="styles.border"
      >{{ text }}</span>
  `,
})
export class MusicTagComponent {
  @Input({ required: true }) text!: string;
  @Input({ required: true }) variant!: "green" | "red" | "default";
  @Input() theme?: Theme;

  get styles(): { bg: string; text: string; border: string } {
    const c = getMusicThemeColors(this.theme);
    const colorMap: Record<string, { bg: string; text: string; border?: string }> = {
      green: { bg: c.successBg, text: c.success },
      red: { bg: c.errorBg, text: c.error },
      default: { bg: c.tagBg, text: c.tagText, border: `1px solid ${c.tagBorder}` },
    };
    const s = colorMap[this.variant] || colorMap.default;
    return { bg: s.bg, text: s.text, border: s.border ?? "none" };
  }
}
