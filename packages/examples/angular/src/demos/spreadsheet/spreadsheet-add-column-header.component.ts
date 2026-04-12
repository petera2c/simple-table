import { Component } from "@angular/core";
import { triggerSpreadsheetAddColumn } from "./spreadsheet-add-column-bridge";

@Component({
  standalone: true,
  selector: "demo-spreadsheet-add-column-header",
  template: `
    <div style="display:flex;justify-content:center;">
      <button
        type="button"
        (click)="onAdd()"
        style="color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:500;white-space:nowrap;background:#3b82f6;"
      >
        + Add Column
      </button>
    </div>
  `,
})
export class SpreadsheetAddColumnHeaderComponent {
  onAdd(): void {
    triggerSpreadsheetAddColumn();
  }
}
