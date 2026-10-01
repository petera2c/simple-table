import { Component, Input } from "@angular/core";
import type { ProjectTask } from "./cell-clicking.demo-data";

@Component({
  standalone: true,
  selector: "demo-cell-click-status",
  template: `
    <span
      [style.background]="bg"
      [style.color]="fg"
      style="padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold;cursor:pointer;"
      title="Click to change status"
      >{{ row.status }}</span>
  `,
})
export class CellClickStatusCellComponent {
  @Input({ required: true }) row!: ProjectTask;

  get bg(): string {
    const s = this.row.status;
    if (s === "Completed") return "#dcfce7";
    if (s === "In Progress") return "#fef3c7";
    return "#fee2e2";
  }

  get fg(): string {
    const s = this.row.status;
    if (s === "Completed") return "#166534";
    if (s === "In Progress") return "#92400e";
    return "#991b1b";
  }
}
