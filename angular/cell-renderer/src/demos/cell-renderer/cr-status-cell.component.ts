import { Component, Input } from "@angular/core";
import type { CellValue } from "@simple-table/angular";

@Component({
  standalone: true,
  selector: "demo-cr-status",
  template: `
    <span [style.color]="meta.color" style="font-weight:600;text-transform:capitalize;">{{ meta.icon }} {{ status }}</span>
  `,
})
export class CrStatusCellComponent {
  @Input() value!: CellValue;

  get status(): string {
    return String(this.value);
  }

  get meta(): { icon: string; color: string } {
    const map: Record<string, { icon: string; color: string }> = {
      active: { icon: "✓", color: "#10B981" },
      inactive: { icon: "✕", color: "#EF4444" },
      pending: { icon: "!", color: "#F59E0B" },
    };
    return map[this.status] ?? { icon: "?", color: "#6b7280" };
  }
}
