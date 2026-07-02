import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getHRThemeColors } from "./hr.demo-data";
import type { HREmployee } from "./hr.demo-data";

@Component({
  standalone: true,
  selector: "demo-hr-salary",
  template: `<span [style.color]="c.gray">{{ display }}</span>`,
})
export class HrSalaryCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): HREmployee {
    return this.row as unknown as HREmployee;
  }

  get c(): Record<string, string> {
    return getHRThemeColors(this.theme);
  }

  get display(): string {
    return `$${this.d.salary.toLocaleString()}`;
  }
}
