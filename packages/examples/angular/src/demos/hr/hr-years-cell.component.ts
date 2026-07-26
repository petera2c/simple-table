import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getHRThemeColors } from "./hr.demo-data";
import type { HREmployee } from "./hr.demo-data";

@Component({
  standalone: true,
  selector: "demo-hr-years",
  template: `
    @if (d.yearsOfService !== null) {
      <span [style.color]="c.gray">{{ row.yearsOfService }} yrs</span>
    }
  `,
})
export class HrYearsCellComponent {
  @Input({ required: true }) row!: HREmployee;
  @Input() theme?: Theme;

  get c() {
    return getHRThemeColors(this.theme);
  }
}
