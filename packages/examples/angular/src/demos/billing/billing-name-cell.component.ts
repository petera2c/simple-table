import { Component, Input } from "@angular/core";
import type {  } from "@simple-table/angular";
import type { BillingRow } from "./billing.demo-data";

@Component({
  standalone: true,
  selector: "demo-billing-name-cell",
  template: `
    @if (isAccount) {
      <span style="font-weight:600;">{{ name }}</span>
    } @else {
      {{ name }}
    }
  `,
})
export class BillingNameCellComponent {
  @Input({ required: true }) row!: BillingRow;

  get isAccount(): boolean {
    return this.row.type === "account";
  }

  get name(): string {
    return this.row.name;
  }
}
