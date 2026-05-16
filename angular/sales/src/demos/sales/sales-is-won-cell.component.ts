import { Component, Input } from "@angular/core";
import type { Row } from "@simple-table/angular";
import type { SalesRow } from "./sales.demo-data";

@Component({
  standalone: true,
  selector: "demo-sales-is-won",
  template: `
    @if (row.isWon === "—") {
      —
    } @else {
      <span
        style="padding:0 7px;font-size:12px;line-height:20px;border-radius:2px;display:inline-block;"
        [style.background-color]="pill.bg"
        [style.color]="pill.text"
        >{{ d.isWon ? "Won" : "Lost" }}</span>
    }
  `,
})
export class SalesIsWonCellComponent {
  @Input({ required: true }) row!: Row;

  get d(): SalesRow {
    return this.row as unknown as SalesRow;
  }

  get pill(): { bg: string; text: string } {
    return this.d.isWon
      ? { bg: "#f6ffed", text: "#2a6a0d" }
      : { bg: "#fff1f0", text: "#a8071a" };
  }
}
