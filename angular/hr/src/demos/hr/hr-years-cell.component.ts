import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getHRThemeColors } from "./hr.demo-data";
import type { HREmployee } from "./hr.demo-data";

@Component({
  standalone: true,
  selector: "demo-hr-years",
  template: `
    @if (d.yearsOfService !== null) {
      <span [style.color]="c.gray">{{ d.yearsOfService }} yrs</span>
    }
  `,
})
export class HrYearsCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): HREmployee {
    return this.row as unknown as HREmployee;
  }

  get c(): Record<string, string> {
    return getHRThemeColors(this.theme);
  }
}
