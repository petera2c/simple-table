import { Component, Input } from "@angular/core";
import type { ProjectTask } from "./cell-clicking.demo-data";

@Component({
  standalone: true,
  selector: "demo-cell-click-priority",
  template: `
    <span [style.color]="color" style="font-weight:bold;cursor:pointer;" title="Click to filter by priority">{{ row.priority }}</span>
  `,
})
export class CellClickPriorityCellComponent {
  @Input({ required: true }) row!: ProjectTask;

  get color(): string {
    const p = this.row.priority;
    if (p === "High") return "#ef4444";
    if (p === "Medium") return "#f59e0b";
    return "#10b981";
  }
}
