import { Component, Input } from "@angular/core";
import type { CRMLead } from "./crm.demo-data";

@Component({
  standalone: true,
  selector: "demo-crm-ai-score",
  template: `<div style="font-size:0.875rem;">{{ fire }}</div>`,
})
export class CrmAiScoreCellComponent {
  @Input({ required: true }) row!: CRMLead;

  get fire(): string {
    return "🔥".repeat(this.row.aiScore);
  }
}
