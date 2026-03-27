import { Component, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { rowGroupingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "row-grouping-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="margin-bottom: 8px; display: flex; gap: 8px; flex-wrap: wrap">
        <button (click)="expandAll()">Expand All</button>
        <button (click)="collapseAll()">Collapse All</button>
        <button (click)="expandDepth0()">Expand Depth 0</button>
        <button (click)="collapseDepth0()">Collapse Depth 0</button>
        <button (click)="toggleDepth0()">Toggle Depth 0</button>
      </div>
      <simple-table
        #simpleTable
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
        [rowGrouping]="grouping"
      ></simple-table>
    </div>
  `,
})
export class RowGroupingDemoComponent {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = rowGroupingConfig.rows;
  readonly headers: AngularHeaderObject[] = rowGroupingConfig.headers;
  readonly grouping = ["id"];

  expandAll(): void {
    this.tableRef.getAPI()?.expandAll();
  }

  collapseAll(): void {
    this.tableRef.getAPI()?.collapseAll();
  }

  expandDepth0(): void {
    this.tableRef.getAPI()?.expandDepth(0);
  }

  collapseDepth0(): void {
    this.tableRef.getAPI()?.collapseDepth(0);
  }

  toggleDepth0(): void {
    this.tableRef.getAPI()?.toggleDepth(0);
  }
}
