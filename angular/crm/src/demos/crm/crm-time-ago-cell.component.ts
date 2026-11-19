import { Component, Input } from "@angular/core";
import type { CRMLead } from "./crm.demo-data";
import { crmCellPalette } from "./crm-demo-context";

@Component({
  standalone: true,
  selector: "demo-crm-time-ago",
  template: `<div style="font-size:13px;" [style.color]="palette().textSecondary">{{ row.timeAgo }}</div>`,
})
export class CrmTimeAgoCellComponent {
  @Input({ required: true }) row!: CRMLead;

  protected readonly palette = crmCellPalette;
}
