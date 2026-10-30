import { ChangeDetectorRef, Component } from "@angular/core";
import { crmCellPalette } from "./crm-demo-context";

@Component({
  standalone: true,
  selector: "demo-crm-email-enrich",
  template: `
    @if (email) {
      <span
        style="margin-right:8px;display:inline-flex;cursor:default;align-items:center;column-gap:6px;border-radius:9999px;padding-inline:8px;padding-block:4px;font-size:12px;font-weight:500;"
        [style.background-color]="colors().tagBg"
        [style.color]="colors().tagText"
        >{{ email }}</span>
    } @else if (isLoading) {
      <span
        style="margin-right:8px;display:inline-flex;cursor:default;align-items:center;column-gap:6px;border-radius:9999px;padding-inline:8px;padding-block:4px;font-size:12px;font-weight:500;"
        [style.background-color]="colors().tagBg"
        [style.color]="colors().tagText"
      >
        <div
          style="width:12px;height:12px;border-radius:50%;animation:spin 1s linear infinite;display:inline-block;margin-right:6px;vertical-align:middle;"
          [style.border]="'2px solid ' + colors().buttonHoverBg"
          [style.border-top]="'2px solid ' + colors().accent"
        ></div>
        Enriching...
      </span>
    } @else {
      <span
        style="cursor:pointer;display:inline-flex;align-items:center;column-gap:6px;border-radius:9999px;padding-inline:8px;padding-block:4px;font-size:12px;font-weight:500;background-color:color-mix(in oklab, oklch(62.3% 0.214 259.815) 10%, transparent);"
        [style.color]="colors().tagText"
        (click)="onClick()"
        (keydown.enter)="onClick()"
        role="button"
        tabindex="0"
      >
        Enrich
      </span>
    }
  `,
})
export class CrmEmailEnrichComponent {
  protected readonly colors = crmCellPalette;

  isLoading = false;
  email: string | null = null;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  onClick(): void {
    if (this.isLoading || this.email) return;
    this.isLoading = true;
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "company.com"];
    const names = ["john", "jane", "mike", "sarah", "david", "lisa", "chris", "emma"];
    setTimeout(() => {
      this.email = `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 999) + 1}@${domains[Math.floor(Math.random() * domains.length)]}`;
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 2000);
  }
}
