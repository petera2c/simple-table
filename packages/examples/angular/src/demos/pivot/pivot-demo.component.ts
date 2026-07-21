import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, PivotConfig, Row, Theme } from "@simple-table/angular";
import { pivotDemoConfig, pivotPresets, type PivotPreset } from "./pivot.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "pivot-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        @for (preset of presets; track preset.id) {
          <button
            type="button"
            (click)="selectPreset(preset)"
            [style.padding]="'6px 12px'"
            [style.borderRadius]="'6px'"
            [style.border]="'none'"
            [style.cursor]="'pointer'"
            [style.fontSize]="'13px'"
            [style.fontWeight]="500"
            [style.background]="preset.id === activeId ? '#2563eb' : '#e5e7eb'"
            [style.color]="preset.id === activeId ? '#fff' : '#374151'"
          >
            {{ preset.label }}
          </button>
        }
      </div>
      <simple-table
        [rows]="rows"
        [defaultHeaders]="headers"
        [pivot]="pivot"
        [columnResizing]="true"
        [expandAll]="nestedRows"
        [height]="height"
        [selectableCells]="true"
        [theme]="theme"
      ></simple-table>
    </div>
  `,
})
export class PivotDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = pivotDemoConfig.rows;
  readonly headers: AngularHeaderObject[] = pivotDemoConfig.headers;
  readonly presets = pivotPresets;

  activeId = pivotPresets[0].id;
  pivot: PivotConfig = pivotPresets[0].pivot;
  nestedRows = pivotPresets[0].pivot.rows.length > 1;

  selectPreset(preset: PivotPreset): void {
    this.activeId = preset.id;
    this.pivot = preset.pivot;
    this.nestedRows = preset.pivot.rows.length > 1;
  }
}
