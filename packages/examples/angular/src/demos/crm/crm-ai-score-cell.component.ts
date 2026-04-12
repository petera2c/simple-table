import { Component, Input } from "@angular/core";
import type { Row } from "@simple-table/angular";
import type { CRMLead } from "./crm.demo-data";

@Component({
  standalone: true,
  selector: "demo-crm-ai-score",
  template: `<div style="font-size:0.875rem;">{{ fire }}</div>`,
})
export class CrmAiScoreCellComponent {
  @Input({ required: true }) row!: Row;

  get d(): CRMLead {
    return this.row as unknown as CRMLead;
  }

  get fire(): string {
    return "🔥".repeat(this.d.aiScore);
  }
}
