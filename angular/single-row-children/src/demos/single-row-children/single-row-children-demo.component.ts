import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { singleRowChildrenConfig } from "./single-row-children.demo-data";
import "@simple-table/angular/styles.css";
import type { StudentRecord } from "./single-row-children.demo-data";

@Component({
  selector: "single-row-children-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [columns]="headers"
      [rows]="rows"
      [columnResizing]="true"
      [selectableCells]="true"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class SingleRowChildrenDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularColumnDef<StudentRecord>[] = singleRowChildrenConfig.headers;
  readonly rows: StudentRecord[] = singleRowChildrenConfig.rows;

  getRowId = ({ row }: GetRowIdParams<StudentRecord>) => row.id;
}
