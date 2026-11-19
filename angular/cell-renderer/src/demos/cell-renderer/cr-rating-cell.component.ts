import { Component, Input } from "@angular/core";
import type { CellValue } from "@simple-table/angular";

@Component({
  standalone: true,
  selector: "demo-cr-rating",
  template: `
    <span style="display:flex;align-items:center;gap:4px;">
      <span style="color:#F59E0B;letter-spacing:1px;">
        @for (_ of repeat(fullCount); track $index) {
          ★
        }
        @if (hasHalf) {
          <span style="opacity:0.5;">★</span>
        }
        @for (_ of repeat(emptyCount); track $index) {
          ☆
        }
      </span>
      <span style="font-size:12px;color:#6b7280;">{{ rating }}</span>
    </span>
  `,
})
export class CrRatingCellComponent {
  @Input() value!: CellValue;

  get rating(): number {
    return Number(this.value) || 0;
  }

  get fullCount(): number {
    return Math.floor(this.rating);
  }

  get hasHalf(): boolean {
    return this.rating % 1 >= 0.25;
  }

  get emptyCount(): number {
    return Math.max(0, 5 - this.fullCount - (this.hasHalf ? 1 : 0));
  }

  repeat(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
