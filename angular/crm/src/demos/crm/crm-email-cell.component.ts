import { Component } from "@angular/core";
import { CrmEmailEnrichComponent } from "./crm-email-enrich.component";

@Component({
  standalone: true,
  selector: "demo-crm-email-cell",
  imports: [CrmEmailEnrichComponent],
  template: `<demo-crm-email-enrich />`,
})
export class CrmEmailCellComponent {}
