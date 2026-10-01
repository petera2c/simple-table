import { Component } from "@angular/core";
import { crmCellPalette } from "./crm-demo-context";

@Component({
  standalone: true,
  selector: "demo-crm-contact-now",
  template: `
    <a
      href="#"
      style="cursor:pointer;font-size:0.875rem;text-decoration:none;font-weight:600;"
      [style.color]="palette().link"
      (click)="$event.preventDefault()"
      >Contact Now</a>
  `,
})
export class CrmContactNowCellComponent {
  protected readonly palette = crmCellPalette;
}
