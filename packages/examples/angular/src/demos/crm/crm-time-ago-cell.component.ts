import { Component, Input } from "@angular/core";
import type { Row } from "@simple-table/angular";
import type { CRMLead } from "./crm.demo-data";
import { crmCellPalette } from "./crm-demo-context";

@Component({
  standalone: true,
  selector: "demo-crm-time-ago",
  template: `<div style="font-size:13px;" [style.color]="palette().textSecondary">{{ d.timeAgo }}</div>`,
})
export class CrmTimeAgoCellComponent {
  @Input({ required: true }) row!: Row;

  protected readonly palette = crmCellPalette;

  get d(): CRMLead {
    return this.row as unknown as CRMLead;
  }
}
