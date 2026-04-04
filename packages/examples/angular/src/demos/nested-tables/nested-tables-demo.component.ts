import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import { nestedTablesConfig, generateNestedTablesData } from "./nested-tables.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "nested-tables-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [autoExpandColumns]="true"
      [defaultHeaders]="headers"
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

  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(nestedTablesConfig.headers);
  readonly sampleData = generateNestedTablesData(25);
  readonly grouping = ["divisions"];
  readonly getRowId = ({ row }: { row: Record<string, unknown> }) => row["id"] as string;
}
