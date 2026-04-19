import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getThemeColors } from "./sales.demo-data";
import type { SalesRow } from "./sales.demo-data";

@Component({
  standalone: true,
  selector: "demo-sales-profit-margin",
  template: `
    @if (row.profitMargin === "—") {
      —
    } @else {
      <div style="display:flex;align-items:center;justify-content:flex-end;">
        <span [style.color]="textColor" [style.font-weight]="textWeight">{{ pctLabel }}</span>
        <div style="margin-left:8px;width:48px;">
          <div style="background:#f5f5f5;height:6px;width:100%;border-radius:100px;overflow:hidden;">
            <div
              style="height:100%;border-radius:100px;"
              [style.width.%]="pctWidth"
              [style.background-color]="barColor"
            ></div>
          </div>
        </div>
      </div>
    }
  `,
})
export class SalesProfitMarginCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): SalesRow {
    return this.row as unknown as SalesRow;
  }

  get c(): ReturnType<typeof getThemeColors> {
    return getThemeColors(this.theme);
  }

  get pm(): number {
    return this.d.profitMargin as number;
  }

  get pctLabel(): string {
    return `${(this.pm * 100).toFixed(1)}%`;
  }

  get pctWidth(): number {
    return this.pm * 100;
  }

  get textColor(): string {
    const c = this.c;
    const m = this.pm;
    if (m >= 0.7) return c.success.high.color;
    if (m >= 0.5) return c.success.medium;
    if (m >= 0.4) return c.success.low;
    if (m >= 0.3) return c.info;
    return c.warning;
  }

  get textWeight(): string {
    return this.pm >= 0.7 ? this.c.success.high.fontWeight : "normal";
  }

  get barColor(): string {
    const pc = this.c.progressColors;
    return this.pm >= 0.5 ? pc.high : this.pm >= 0.3 ? pc.medium : pc.low;
  }
}
