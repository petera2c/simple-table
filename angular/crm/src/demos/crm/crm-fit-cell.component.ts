import { Component, signal } from "@angular/core";
import { crmCellPalette } from "./crm-demo-context";

@Component({
  standalone: true,
  selector: "demo-crm-fit",
  template: `
    <div style="display:flex;align-items:center;">
      <button
        type="button"
        [style.flex]="'1'"
        style="padding:4px 8px;font-size:0.75rem;font-weight:500;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s;border-top-left-radius:6px;border-bottom-left-radius:6px;"
        [style.color]="palette().buttonText"
        [style.background-color]="bgFit()"
        (click)="toggle('fit')"
      >
        ✓
      </button>
      <button
        type="button"
        [style.flex]="'1'"
        style="padding:4px 8px;font-size:0.75rem;font-weight:500;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s;"
        [style.color]="palette().buttonText"
        [style.background-color]="bgPartial()"
        (click)="toggle('partial')"
      >
        ?
      </button>
      <button
        type="button"
        [style.flex]="'1'"
        style="padding:4px 8px;font-size:0.75rem;font-weight:500;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s;border-top-right-radius:6px;border-bottom-right-radius:6px;"
        [style.color]="palette().buttonText"
        [style.background-color]="bgNo()"
        (click)="toggle('no')"
      >
        X
      </button>
    </div>
  `,
})
export class CrmFitCellComponent {
  protected readonly palette = crmCellPalette;
  private readonly selected = signal<string | null>(null);

  bgFit(): string {
    return this.selected() === "fit" ? "oklch(62.7% 0.194 149.214)" : "oklch(92.5% 0.084 155.995)";
  }

  bgPartial(): string {
    const c = this.palette();
    return this.selected() === "partial" ? c.buttonHoverBg : c.buttonBg;
  }

  bgNo(): string {
    return this.selected() === "no" ? "oklch(64.6% 0.222 41.116)" : "oklch(90.1% 0.076 70.697)";
  }

  toggle(key: string): void {
    this.selected.update((s) => (s === key ? null : key));
  }
}
