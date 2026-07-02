import { Component, Input } from "@angular/core";
import type { Row, Theme } from "@simple-table/angular";
import { getHRThemeColors } from "./hr.demo-data";
import type { HREmployee } from "./hr.demo-data";

@Component({
  standalone: true,
  selector: "demo-hr-performance",
  template: `
    <div style="width:100%;display:flex;flex-direction:column;">
      <div
        style="height:6px;width:100%;border-radius:100px;overflow:hidden;"
        [style.background-color]="c.progressBg"
      >
        <div
          style="height:100%;border-radius:100px;"
          [style.width.%]="score"
          [style.background-color]="barColor"
        ></div>
      </div>
      <div style="font-size:12px;text-align:center;margin-top:4px;" [style.color]="c.gray">{{ score }}/100</div>
    </div>
  `,
})
export class HrPerformanceCellComponent {
  @Input({ required: true }) row!: Row;
  @Input() theme?: Theme;

  get d(): HREmployee {
    return this.row as unknown as HREmployee;
  }

  get score(): number {
    return this.d.performanceScore;
  }

  get c(): ReturnType<typeof getHRThemeColors> {
    return getHRThemeColors(this.theme);
  }

  get barColor(): string {
    const s = this.score;
    const colors = this.c;
    if (s >= 90) return colors.progressSuccess;
    if (s >= 65) return colors.progressNormal;
    return colors.progressException;
  }
}
