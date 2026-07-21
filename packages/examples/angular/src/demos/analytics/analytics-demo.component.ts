import { Component, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, PivotConfig, Row, Theme } from "@simple-table/angular";
import {
  analyticsDemoConfig,
  analyticsPresets,
  type AnalyticsPreset,
} from "./analytics.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "analytics-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div
      [style.display]="'flex'"
      [style.flexDirection]="'column'"
      [style.width]="'100%'"
      [style.height]="formatHeight"
      [style.background]="chromeBg"
      [style.border]="'1px solid ' + chromeBorder"
      [style.borderRadius]="'8px'"
      [style.overflow]="'hidden'"
    >
      <div
        [style.padding]="'16px 20px 12px'"
        [style.borderBottom]="'1px solid ' + chromeBorder"
        [style.flexShrink]="0"
      >
        <div style="margin-bottom: 10px">
          <h2
            [style.margin]="0"
            [style.fontSize]="'18px'"
            [style.fontWeight]="650"
            [style.color]="titleColor"
            [style.letterSpacing]="'-0.02em'"
          >
            Revenue Analytics
          </h2>
        </div>
        <div
          style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; width: 100%"
        >
          <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
            @for (preset of presets; track preset.id) {
              <button
                type="button"
                (click)="selectPreset(preset)"
                [style.padding]="'7px 12px'"
                [style.borderRadius]="'6px'"
                [style.border]="'none'"
                [style.cursor]="'pointer'"
                [style.fontSize]="'13px'"
                [style.fontWeight]="550"
                [style.background]="preset.id === activeId ? '#2563eb' : chipIdleBg"
                [style.color]="preset.id === activeId ? '#fff' : chipIdleColor"
              >
                {{ preset.label }}
              </button>
            }
          </div>
          <button
            type="button"
            (click)="exportCsv()"
            [style.padding]="'7px 12px'"
            [style.borderRadius]="'6px'"
            [style.border]="'1px solid ' + inputBorder"
            [style.cursor]="'pointer'"
            [style.fontSize]="'13px'"
            [style.fontWeight]="550"
            [style.background]="chipIdleBg"
            [style.color]="chipIdleColor"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div
        style="flex: 1; min-height: 0; padding: 12px 20px 20px; display: flex; flex-direction: column"
      >
        <div style="flex: 1; min-height: 0; height: 100%">
          <simple-table
            #simpleTable
            [autoExpandColumns]="true"
            [columnBorders]="true"
            [columnReordering]="true"
            [columnResizing]="true"
            [rows]="rows"
            [defaultHeaders]="headers"
            [editColumns]="true"
            [expandAll]="nestedRows"
            [getRowId]="getRowId"
            height="100%"
            [initialSortColumn]="isPivoted ? undefined : 'sales'"
            [initialSortDirection]="isPivoted ? undefined : 'desc'"
            [pivot]="pivot"
            [selectableCells]="true"
            [theme]="theme"
          ></simple-table>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticsDemoComponent {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number | null = "480px";
  @Input() theme?: Theme;

  readonly rows: Row[] = analyticsDemoConfig.rows;
  readonly headers: AngularHeaderObject[] = analyticsDemoConfig.headers;
  readonly presets = analyticsPresets;
  readonly getRowId = ({ row }: { row: Row }) =>
    row.id == null ? undefined : String(row.id);

  activeId = analyticsPresets[0].id;
  pivot: PivotConfig | null = analyticsPresets[0].pivot;
  nestedRows = (analyticsPresets[0].pivot?.rows.length ?? 0) > 1;
  isPivoted = analyticsPresets[0].pivot != null;

  get formatHeight(): string {
    if (this.height == null) return "100%";
    if (typeof this.height === "number") return `${this.height}px`;
    return this.height;
  }

  get isDark(): boolean {
    return this.theme === "dark" || this.theme === "modern-dark";
  }

  get chromeBg(): string {
    return this.isDark ? "#0f172a" : "#f8fafc";
  }

  get chromeBorder(): string {
    return this.isDark ? "#1e293b" : "#e2e8f0";
  }

  get titleColor(): string {
    return this.isDark ? "#f1f5f9" : "#0f172a";
  }

  get chipIdleBg(): string {
    return this.isDark ? "#1e293b" : "#e2e8f0";
  }

  get chipIdleColor(): string {
    return this.isDark ? "#cbd5e1" : "#334155";
  }

  get inputBorder(): string {
    return this.isDark ? "#334155" : "#cbd5e1";
  }

  selectPreset(preset: AnalyticsPreset): void {
    this.activeId = preset.id;
    this.pivot = preset.pivot;
    this.nestedRows = (preset.pivot?.rows.length ?? 0) > 1;
    this.isPivoted = preset.pivot != null;
  }

  exportCsv(): void {
    this.tableRef.getAPI()?.exportToCSV();
  }
}
