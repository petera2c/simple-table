import { Component, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, PivotConfig, Theme } from "@simple-table/angular";
import {
  analyticsDemoConfig,
  analyticsPresets,
  type AnalyticsPreset,
} from "./analytics.demo-data";
import "@simple-table/angular/styles.css";
import type { AnalyticsFactRow } from "./analytics.demo-data";

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
      [style.overflow]="'hidden'"
    >
      <div
        [style.padding]="'0 0 12px'"
        [style.borderBottom]="'1px solid ' + chrome.border"
        [style.flexShrink]="0"
      >
        <div style="margin-bottom: 10px">
          <h2
            [style.margin]="0"
            [style.fontSize]="'18px'"
            [style.fontWeight]="650"
            [style.color]="chrome.title"
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
                [style.background]="preset.id === activeId ? chrome.chipActive : chrome.chipIdleBg"
                [style.color]="preset.id === activeId ? '#fff' : chrome.chipIdleColor"
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
            [style.border]="'1px solid ' + chrome.border"
            [style.cursor]="'pointer'"
            [style.fontSize]="'13px'"
            [style.fontWeight]="550"
            [style.background]="chrome.chipIdleBg"
            [style.color]="chrome.chipIdleColor"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div
        style="flex: 1; min-height: 0; display: flex; flex-direction: column"
      >
        <div style="flex: 1; min-height: 0; height: 100%">
          <simple-table
            #simpleTable
            [autoExpandColumns]="true"
            [columnBorders]="true"
            [columnReordering]="true"
            [columnResizing]="true"
            [rows]="rows"
            [columns]="headers"
            [enableColumnEditor]="true"
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

  readonly rows: AnalyticsFactRow[] = analyticsDemoConfig.rows;
  readonly headers: AngularColumnDef<AnalyticsFactRow>[] = analyticsDemoConfig.headers;
  readonly presets = analyticsPresets;
  readonly getRowId = ({ row }: GetRowIdParams<AnalyticsFactRow>) => row.id == null ? undefined : String(row.id);

  activeId = analyticsPresets[0].id;
  pivot: PivotConfig<AnalyticsFactRow> | null = analyticsPresets[0].pivot;
  isPivoted = analyticsPresets[0].pivot != null;

  get formatHeight(): string {
    if (this.height == null) return "100%";
    if (typeof this.height === "number") return `${this.height}px`;
    return this.height;
  }

  get chrome() {
    if (this.theme === "modern-black") {
      return {
        border: "#262626",
        chipActive: "#3b82f6",
        chipIdleBg: "#1c1c1c",
        chipIdleColor: "#a3a3a3",
        title: "#fafafa",
      };
    }
    if (this.theme === "modern-dark" || this.theme === "dark") {
      return {
        border: "#374151",
        chipActive: "#3b82f6",
        chipIdleBg: "#1f2937",
        chipIdleColor: "#d1d5db",
        title: "#f9fafb",
      };
    }
    return {
      border: "#e5e5e5",
      chipActive: "#2563eb",
      chipIdleBg: "#f5f5f5",
      chipIdleColor: "#525252",
      title: "#171717",
    };
  }

  selectPreset(preset: AnalyticsPreset): void {
    this.activeId = preset.id;
    this.pivot = preset.pivot;
    this.isPivoted = preset.pivot != null;
  }

  exportCsv(): void {
    this.tableRef.getAPI()?.exportToCSV();
  }
}
