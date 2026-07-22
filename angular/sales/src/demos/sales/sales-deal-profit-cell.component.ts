import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getThemeColors } from "./sales.demo-data";
import type { SalesRow } from "./sales.demo-data";

@Component({
  standalone: true,
  selector: "demo-sales-deal-profit",
  template: `
    @if (row.dealProfit === "—") {
      —
    } @else if (d.dealProfit === 0) {
      <span [style.color]="c.grayMuted">$0.00</span>
    } @else {
      <span [style.color]="textColor" [style.font-weight]="textWeight">{{ profitText }}</span>
    }
  `,
})
export class SalesDealProfitCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): SalesRow {
    return this.row as unknown as SalesRow;
  }

  get c(): ReturnType<typeof getThemeColors> {
    return getThemeColors(this.theme);
  }

  get profitText(): string {
    return `$${(this.d.dealProfit as number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  get textColor(): string {
    const v = this.d.dealProfit as number;
    const c = this.c;
    if (v > 50000) return c.success.high.color;
    if (v > 20000) return c.success.medium;
    if (v > 10000) return c.success.low;
    return c.gray;
  }

  get textWeight(): string {
    return (this.d.dealProfit as number) > 50000 ? this.c.success.high.fontWeight : "normal";
  }
}
