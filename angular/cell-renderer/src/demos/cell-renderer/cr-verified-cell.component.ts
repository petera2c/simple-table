import { Component, Input } from "@angular/core";
import type { CellValue } from "@simple-table/angular";

@Component({
  standalone: true,
  selector: "demo-cr-verified",
  template: `
    <span [style.color]="yes ? '#10B981' : '#EF4444'" style="font-weight:600;">{{ yes ? "✓ Yes" : "✕ No" }}</span>
  `,
})
export class CrVerifiedCellComponent {
  @Input() value!: CellValue;

  get yes(): boolean {
    return Boolean(this.value);
  }
}
