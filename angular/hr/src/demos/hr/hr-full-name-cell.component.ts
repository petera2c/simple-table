import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getHRThemeColors } from "./hr.demo-data";
import type { HREmployee } from "./hr.demo-data";

@Component({
  standalone: true,
  selector: "demo-hr-full-name",
  template: `
    <div style="display:flex;align-items:center;">
      <div
        style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;"
        [style.background-color]="c.avatarBg"
        [style.color]="c.avatarText"
      >
        {{ initials }}
      </div>
      <div style="margin-left:8px;">
        <div>{{ row.fullName }}</div>
        <div style="font-size:12px;" [style.color]="c.grayMuted">{{ row.position }}</div>
      </div>
    </div>
  `,
})
export class HrFullNameCellComponent {
  @Input({ required: true }) row!: HREmployee;
  @Input() theme?: Theme;

  get c() {
    return getHRThemeColors(this.theme);
  }

  get initials(): string {
    return `${this.row.firstName?.charAt(0) || ""}${this.row.lastName?.charAt(0) || ""}`;
  }
}
