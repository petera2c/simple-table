import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getHRThemeColors } from "./hr.demo-data";
import type { HREmployee } from "./hr.demo-data";

@Component({
  standalone: true,
  selector: "demo-hr-salary",
  template: `<span [style.color]="c.gray">{{ display }}</span>`,
})
export class HrSalaryCellComponent {
  @Input({ required: true }) row!: HREmployee;
  @Input() theme?: Theme;

  get c() {
    return getHRThemeColors(this.theme);
  }

  get display(): string {
    return `$${this.row.salary.toLocaleString()}`;
  }
}
