import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getHRThemeColors } from "./hr.demo-data";
import type { HREmployee } from "./hr.demo-data";

@Component({
  standalone: true,
  selector: "demo-hr-hire-date",
  template: `
    @if (d.hireDate) {
      <span [style.color]="c.gray">{{ formatted }}</span>
    }
  `,
})
export class HrHireDateCellComponent {
  @Input({ required: true }) row!: HREmployee;
  @Input() theme?: Theme;

  get c() {
    return getHRThemeColors(this.theme);
  }

  get formatted(): string {
    const raw = this.row.hireDate;
    if (!raw) return "";
    const [year, month, day] = raw.split("-").map(Number);
    const date = new Date(year!, month! - 1, day!);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
}
