import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getThemeColors } from "./sales.demo-data";
import type { SalesRow } from "./sales.demo-data";

@Component({
  standalone: true,
  selector: "demo-sales-commission",
  template: `
    @if (row.commission === "—") {
      —
    } @else if (d.commission === 0) {
      <span [style.color]="c.grayMuted">$0.00</span>
    } @else {
      {{ commissionText }}
    }
  `,
})
export class SalesCommissionCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): SalesRow {
    return this.row as unknown as SalesRow;
  }

  get c(): ReturnType<typeof getThemeColors> {
    return getThemeColors(this.theme);
  }

  get commissionText(): string {
    return `$${this.d.commission.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
