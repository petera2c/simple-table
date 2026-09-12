import { Component, Input } from "@angular/core";
import type { CRMLead } from "./crm.demo-data";
import { crmCellPalette } from "./crm-demo-context";

@Component({
  standalone: true,
  selector: "demo-crm-list",
  template: `
    <a
      href="#"
      style="cursor:pointer;font-size:0.875rem;text-decoration:none;font-weight:600;"
      [style.color]="palette().link"
      (click)="$event.preventDefault()"
      >{{ row.list }}</a>
  `,
})
export class CrmListCellComponent {
  @Input({ required: true }) row!: CRMLead;

  protected readonly palette = crmCellPalette;
}
