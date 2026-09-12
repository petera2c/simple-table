import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
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
        >{{ row.status }}</span>
    }
  `,
})
export class HrStatusCellComponent {
  @Input({ required: true }) row!: HREmployee;
  @Input() theme?: Theme;

  get c(): ReturnType<typeof getHRThemeColors> {
    return getHRThemeColors(this.theme);
  }

  get tagColors(): { bg: string; text: string } {
    const status = this.row.status || "";
    const key: HRTagColorKey = HR_STATUS_COLOR_MAP[status] || "default";
    return this.c.tagColors[key] || this.c.tagColors.default;
  }
}
