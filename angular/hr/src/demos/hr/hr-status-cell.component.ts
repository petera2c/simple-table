import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getHRThemeColors, HR_STATUS_COLOR_MAP } from "./hr.demo-data";
import type { HREmployee, HRTagColorKey } from "./hr.demo-data";

@Component({
  standalone: true,
  selector: "demo-hr-status",
  template: `
    @if (d.status) {
      <span
        style="padding:0 7px;font-size:12px;line-height:20px;border-radius:2px;display:inline-block;"
        [style.background-color]="tagColors.bg"
        [style.color]="tagColors.text"
        >{{ d.status }}</span>
    }
  `,
})
export class HrStatusCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): HREmployee {
    return this.row as unknown as HREmployee;
  }

  get c(): ReturnType<typeof getHRThemeColors> {
    return getHRThemeColors(this.theme);
  }

  get tagColors(): { bg: string; text: string } {
    const status = this.d.status || "";
    const key: HRTagColorKey = HR_STATUS_COLOR_MAP[status] || "default";
    return this.c.tagColors[key] || this.c.tagColors.default;
  }
}
