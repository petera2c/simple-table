import { Component, Input } from "@angular/core";
import type { CellValue } from "@simple-table/angular";

@Component({
  standalone: true,
  selector: "demo-cr-progress",
  template: `
    <div>
      <div style="font-size:12px;margin-bottom:2px;">{{ pct }}%</div>
      <div style="height:10px;background:#E5E7EB;border-radius:5px;overflow:hidden;">
        <div [style.width.%]="pct" [style.background]="barColor" style="height:100%;border-radius:5px;transition:width 0.3s;"></div>
      </div>
    </div>
  `,
})
export class CrProgressCellComponent {
  @Input() value!: CellValue;

  get pct(): number {
    return Number(this.value) || 0;
  }

  get barColor(): string {
    const n = this.pct;
    if (n < 30) return "#EF4444";
    if (n < 70) return "#F59E0B";
    return "#10B981";
  }
}
