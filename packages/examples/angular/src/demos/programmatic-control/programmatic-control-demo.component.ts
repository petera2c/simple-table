import { Component, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { programmaticControlConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "programmatic-control-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="margin-bottom: 8px; display: flex; gap: 8px; flex-wrap: wrap">
        <button (click)="sortAsc()">Sort by ID (Asc)</button>
        <button (click)="sortDesc()">Sort by ID (Desc)</button>
        <button (click)="clearSort()">Clear Sort</button>
        <button (click)="clearFilters()">Clear All Filters</button>
        <button (click)="exportCsv()">Export CSV</button>
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
export class ProgrammaticControlDemoComponent {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = programmaticControlConfig.rows;
  readonly headers: AngularHeaderObject[] = programmaticControlConfig.headers;

  sortAsc(): void {
    this.tableRef.getAPI()?.applySortState({ accessor: "id", direction: "asc" });
  }

  sortDesc(): void {
    this.tableRef.getAPI()?.applySortState({ accessor: "id", direction: "desc" });
  }

  clearSort(): void {
    this.tableRef.getAPI()?.applySortState();
  }

  clearFilters(): void {
    this.tableRef.getAPI()?.clearAllFilters();
  }

  exportCsv(): void {
    this.tableRef.getAPI()?.exportToCSV();
  }
}
