import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { singleRowChildrenConfig } from "./single-row-children.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "single-row-children-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
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

  readonly headers: AngularColumnDef[] = singleRowChildrenConfig.headers;
  readonly rows: Row[] = singleRowChildrenConfig.rows;
}
