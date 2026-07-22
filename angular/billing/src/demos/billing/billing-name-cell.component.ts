import { Component, Input } from "@angular/core";
import type { Row } from "@simple-table/angular";
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
  @Input({ required: true }) row!: Row;

  get d(): BillingRow {
    return this.row as unknown as BillingRow;
  }

  get isAccount(): boolean {
    return this.d.type === "account";
  }

  get name(): string {
    return this.d.name;
  }
}
