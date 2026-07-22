import { Component, Input } from "@angular/core";
import type { Row } from "@simple-table/angular";

@Component({
  standalone: true,
  selector: "demo-cell-click-priority",
  template: `
    <span [style.color]="color" style="font-weight:bold;cursor:pointer;" title="Click to filter by priority">{{ priority }}</span>
  `,
})
export class CellClickPriorityCellComponent {
  @Input({ required: true }) row!: Row;

  get priority(): string {
    return String((this.row as Record<string, unknown>)["priority"]);
  }

  get color(): string {
    const p = this.priority;
    if (p === "High") return "#ef4444";
    if (p === "Medium") return "#f59e0b";
    return "#10b981";
  }
}
