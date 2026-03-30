import { Component, Input } from "@angular/core";
import { NgFor } from "@angular/common";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { themesConfig, AVAILABLE_THEMES } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "themes-demo",
  standalone: true,
  imports: [SimpleTableComponent, NgFor],
  template: `
    <div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px">
        <button
          *ngFor="let t of themes"
          (click)="selectedTheme = t.value"
          [style.padding]="'6px 14px'"
          [style.borderRadius]="'6px'"
          [style.border]="selectedTheme === t.value ? '2px solid #3b82f6' : '1px solid #d1d5db'"
          [style.background]="selectedTheme === t.value ? '#eff6ff' : '#fff'"
          [style.color]="selectedTheme === t.value ? '#1d4ed8' : '#374151'"
          [style.fontWeight]="selectedTheme === t.value ? 600 : 400"
          [style.cursor]="'pointer'"
          [style.fontSize]="'13px'"
        >
          {{ t.label }}
        </button>
      </div>
      <simple-table
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="selectedTheme"
      ></simple-table>
    </div>
  `,
})
export class ThemesDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = themesConfig.rows;
  readonly headers: AngularHeaderObject[] = themesConfig.headers;
  readonly themes = AVAILABLE_THEMES;
  selectedTheme: Theme = "light";

  ngOnInit() {
    if (this.theme) this.selectedTheme = this.theme;
  }
}
