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
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
        <span style="font-size: 13px; font-weight: 600; margin-right: 8px">Control Expansion:</span>
        <button [style.padding]="'6px 12px'" [style.background]="'#28a745'" [style.color]="'white'" [style.border]="'none'" [style.borderRadius]="'4px'" [style.cursor]="'pointer'" [style.fontSize]="'12px'" [style.fontWeight]="500" (click)="expandAll()" title="expandAll()">Expand All</button>
        <button [style.padding]="'6px 12px'" [style.background]="'#dc3545'" [style.color]="'white'" [style.border]="'none'" [style.borderRadius]="'4px'" [style.cursor]="'pointer'" [style.fontSize]="'12px'" [style.fontWeight]="500" (click)="collapseAll()" title="collapseAll()">Collapse All</button>
        <button [style.padding]="'6px 12px'" [style.background]="'#007bff'" [style.color]="'white'" [style.border]="'none'" [style.borderRadius]="'4px'" [style.cursor]="'pointer'" [style.fontSize]="'12px'" [style.fontWeight]="500" (click)="onlyDivisions()" title="expandDepth(0)">Only Divisions</button>
        <button [style.padding]="'6px 12px'" [style.background]="'#6c757d'" [style.color]="'white'" [style.border]="'none'" [style.borderRadius]="'4px'" [style.cursor]="'pointer'" [style.fontSize]="'12px'" [style.fontWeight]="500" (click)="divisionsAndDepts()" title="setExpandedDepths(new Set([0, 1]))">Divisions + Departments</button>
        <button [style.padding]="'6px 12px'" [style.background]="'#6f42c1'" [style.color]="'white'" [style.border]="'none'" [style.borderRadius]="'4px'" [style.cursor]="'pointer'" [style.fontSize]="'12px'" [style.fontWeight]="500" (click)="toggleDivisions()" title="toggleDepth(0)">Toggle Divisions</button>
      </div>
      <simple-table
        #simpleTable
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
        [rowGrouping]="grouping"
        [enableStickyParents]="true"
        [getRowId]="getRowId"
        [columnResizing]="true"
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
  readonly grouping = rowGroupingConfig.tableProps.rowGrouping;
  readonly getRowId = rowGroupingConfig.tableProps.getRowId;

  expandAll() { this.tableRef.getAPI()?.expandAll(); }
  collapseAll() { this.tableRef.getAPI()?.collapseAll(); }
  onlyDivisions() { this.tableRef.getAPI()?.collapseAll(); this.tableRef.getAPI()?.expandDepth(0); }
  divisionsAndDepts() { this.tableRef.getAPI()?.setExpandedDepths(new Set([0, 1])); }
  toggleDivisions() { this.tableRef.getAPI()?.toggleDepth(0); }
}
