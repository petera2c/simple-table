import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getThemeColors } from "./sales.demo-data";
import type { SalesRow } from "./sales.demo-data";

@Component({
  standalone: true,
  selector: "demo-sales-deal-value",
  template: `
    @if (row.dealValue === "—") {
      —
    } @else {
      <span [style.color]="style.color" [style.font-weight]="style.weight">{{ style.text }}</span>
    }
  `,
})
export class SalesDealValueCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): SalesRow {
    return this.row as unknown as SalesRow;
  }

  get style(): { text: string; color: string; weight: string } {
    if (this.row.dealValue === "—") return { text: "—", color: "", weight: "" };
    const c = getThemeColors(this.theme);
    const v = this.d.dealValue as number;
    let color = c.gray;
    let fontWeight = "normal";
    if (v > 100000) {
      color = c.success.high.color;
      fontWeight = c.success.high.fontWeight;
    } else if (v > 50000) color = c.success.medium;
    else if (v > 10000) color = c.success.low;
    return {
      text: `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color,
      weight: fontWeight,
    };
  }
}
