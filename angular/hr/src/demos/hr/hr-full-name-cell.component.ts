import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
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
        <div>{{ d.fullName }}</div>
        <div style="font-size:12px;" [style.color]="c.grayMuted">{{ d.position }}</div>
      </div>
    </div>
  `,
})
export class HrFullNameCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): HREmployee {
    return this.row as unknown as HREmployee;
  }

  get c(): Record<string, string> {
    return getHRThemeColors(this.theme);
  }

  get initials(): string {
    return `${this.d.firstName?.charAt(0) || ""}${this.d.lastName?.charAt(0) || ""}`;
  }
}
