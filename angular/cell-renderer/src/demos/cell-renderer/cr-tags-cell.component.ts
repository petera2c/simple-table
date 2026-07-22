import { Component, Input } from "@angular/core";
import type { CellValue } from "@simple-table/angular";

@Component({
  standalone: true,
  selector: "demo-cr-tags",
  template: `
    <div style="display:flex;gap:4px;flex-wrap:nowrap;overflow:hidden;">
      @for (tag of tags; track tag) {
        <span
          style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:500;background:#DBEAFE;color:#1E40AF;white-space:nowrap;"
          >{{ tag }}</span>
      }
    </div>
  `,
})
export class CrTagsCellComponent {
  @Input() value!: CellValue;

  get tags(): string[] {
    return Array.isArray(this.value) ? (this.value as string[]) : [];
  }
}
