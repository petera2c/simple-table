import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { singleRowChildrenConfig } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "single-row-children-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [defaultHeaders]="headers"
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

  readonly headers: AngularHeaderObject[] = singleRowChildrenConfig.headers;
  readonly rows: Row[] = singleRowChildrenConfig.rows;
}
