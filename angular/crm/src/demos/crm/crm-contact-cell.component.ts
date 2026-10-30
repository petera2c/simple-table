import { Component, Input } from "@angular/core";
import type { CRMLead } from "./crm.demo-data";
import { crmCellPalette } from "./crm-demo-context";

@Component({
  standalone: true,
  selector: "demo-crm-contact",
  template: `
    <div style="display:flex;align-items:center;gap:12px;">
      <div
        style="width:40px;height:40px;border-radius:50%;background:linear-gradient(to right, oklch(75% 0.183 55.934), oklch(70.4% 0.191 22.216));color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;"
      >
        {{ initials }}
      </div>
      <div style="display:flex;flex-direction:column;gap:2px;">
        <span style="cursor:pointer;font-size:14px;font-weight:600;" [style.color]="palette().link">{{ row.name }}</span>
        <div style="font-size:12px;" [style.color]="palette().textSecondary">{{ row.title }}</div>
        <div style="font-size:12px;" [style.color]="palette().textSecondary">
          <span style="font-size:12px;" [style.color]="palette().textTertiary">&#64;</span>
          {{ " " + d.company }}
        </div>
      </div>
    </div>
  `,
})
export class CrmContactCellComponent {
  @Input({ required: true }) row!: CRMLead;

  protected readonly palette = crmCellPalette;

  get initials(): string {
    return this.row.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
}
