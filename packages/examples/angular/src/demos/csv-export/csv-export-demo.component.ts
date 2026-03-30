import { Component, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { csvExportHeaders, csvExportData, csvExportConfig } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "csv-export-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="display: flex; gap: 8px; margin-bottom: 12px">
        <button style="padding: 6px 16px" (click)="handleExport()">Export to CSV</button>
        <button style="padding: 6px 16px" (click)="handleGetInfo()">Get Table Info</button>
      </div>
      <simple-table
        #simpleTable
        [rows]="rows"
        [defaultHeaders]="headers"
        [editColumns]="true"
        [selectableCells]="true"
        [customTheme]="{ rowHeight: 32 }"
        [height]="height"
        [theme]="theme"
      ></simple-table>
    </div>
  `,
})
export class CsvExportDemoComponent {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = csvExportData;
  readonly headers: AngularHeaderObject[] = csvExportHeaders.map((h) => {
    if (h.accessor === "actions") {
      return {
        ...h,
        cellRenderer: () =>
          `<button style="background:#3b82f6;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold">View</button>`,
      };
    }
    return { ...h };
  });

  handleExport(): void {
    this.tableRef.getAPI()?.exportToCSV();
  }

  handleGetInfo(): void {
    const api = this.tableRef.getAPI();
    if (!api) return;
    const rows = api.getAllRows();
    const hdrs = api.getHeaders();
    const totalRevenue = rows.reduce((sum, r) => sum + (Number(r.revenue) || 0), 0);
    alert(
      `Table Info:\n• ${rows.length} rows\n• ${hdrs.length} columns\n• Columns: ${hdrs.map((h) => h.label).join(", ")}\n• Total Revenue: $${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    );
  }
}
