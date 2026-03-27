import { Component, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { csvExportConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "csv-export-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="margin-bottom: 8px">
        <button (click)="exportCsv()">Export to CSV</button>
        <button (click)="exportCsvCustom()" style="margin-left: 8px">
          Export with Custom Name
        </button>
      </div>
      <simple-table
        #simpleTable
        [rows]="rows"
        [defaultHeaders]="headers"
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

  readonly rows: Row[] = csvExportConfig.rows;
  readonly headers: AngularHeaderObject[] = csvExportConfig.headers;

  exportCsv(): void {
    this.tableRef.getAPI()?.exportToCSV();
  }

  exportCsvCustom(): void {
    this.tableRef.getAPI()?.exportToCSV({ filename: "custom-export" });
  }
}
