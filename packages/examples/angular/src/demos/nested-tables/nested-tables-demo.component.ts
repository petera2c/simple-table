import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { nestedTablesConfig, generateNestedTablesData } from "./nested-tables.demo-data";
import "@simple-table/angular/styles.css";
import type { NestedCompany } from "./nested-tables.demo-data";

@Component({
  selector: "nested-tables-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [autoExpandColumns]="true"
      [columns]="headers"
      [rows]="sampleData"
      [rowGrouping]="grouping"
      [getRowId]="getRowId"
      [expandAll]="false"
      [columnResizing]="true"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class NestedTablesDemoComponent {
  @Input() height: string | number = "500px";
  @Input() theme?: Theme;

  readonly headers: AngularColumnDef<NestedCompany>[] = nestedTablesConfig.headers;
  readonly sampleData = generateNestedTablesData(25);
  readonly grouping = ["divisions"];
  readonly getRowId = ({ row }: GetRowIdParams<NestedCompany>) => String(row.id);
}
