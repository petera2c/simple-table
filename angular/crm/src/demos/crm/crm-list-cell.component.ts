import { Component, Input } from "@angular/core";
import type { Row } from "@simple-table/angular";
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
      >{{ d.list }}</a>
  `,
})
export class CrmListCellComponent {
  @Input({ required: true }) row!: Row;

  protected readonly palette = crmCellPalette;

  get d(): CRMLead {
    return this.row as unknown as CRMLead;
  }
}
