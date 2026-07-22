import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getMusicThemeColors } from "./music.demo-data";
import type { MusicArtist } from "./music.demo-data";
import { MusicTagComponent } from "./music-tag.component";

@Component({
  standalone: true,
  selector: "demo-music-artist",
  imports: [MusicTagComponent],
  template: `
    <div style="display:flex;align-items:center;gap:12px;">
      <div [attr.style]="avatarStyle">{{ initial }}</div>
      <div style="display:flex;flex-direction:column;gap:6px;flex:1;">
        <span style="font-weight:500;font-size:14px;" [style.color]="c.gray">{{ d.artistName }}</span>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <demo-music-tag [text]="d.growthStatus" variant="default" [theme]="theme" />
          <demo-music-tag [text]="d.mood" variant="default" [theme]="theme" />
          <demo-music-tag [text]="d.genre" variant="default" [theme]="theme" />
        </div>
      </div>
    </div>
  `,
})
export class MusicArtistCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): MusicArtist {
    return this.row as unknown as MusicArtist;
  }

  get c(): Record<string, string> {
    return getMusicThemeColors(this.theme);
  }

  get initial(): string {
    return this.d.artistName.charAt(0).toUpperCase();
  }

  get avatarStyle(): string {
    let hash = 0;
    const name = this.d.artistName;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `width:40px;height:40px;border-radius:50%;background-color:hsl(${hash % 360}, 65%, 55%);display:flex;align-items:center;justify-content:center;color:white;font-size:16px;flex-shrink:0;`;
  }
}
