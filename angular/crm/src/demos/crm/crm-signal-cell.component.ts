import { Component, Input } from "@angular/core";
import type { CRMLead } from "./crm.demo-data";
import { crmCellPalette } from "./crm-demo-context";

@Component({
  standalone: true,
  selector: "demo-crm-signal",
  template: `
    <div>
      <div style="margin-bottom:4px;font-size:0.875rem;" [style.color]="palette().textSecondary">
        🧠 Just engaged with a
        <a href="#" style="color:#0077b5;text-decoration:underline;cursor:pointer;" (click)="$event.preventDefault()">post</a>
      </div>
      <div style="font-size:12px;" [style.color]="palette().textTertiary">
        <span style="font-weight:600;">Keyword:</span>
        {{ " " + d.signal }}
      </div>
    </div>
  `,
})
export class CrmSignalCellComponent {
  @Input({ required: true }) row!: CRMLead;

  protected readonly palette = crmCellPalette;
}
