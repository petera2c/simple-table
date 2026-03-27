import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row, IconsConfig } from "simple-table-core";
import { customIconsConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "custom-icons-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [icons]="icons"
    ></simple-table>
  `,
})
export class CustomIconsDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = customIconsConfig.rows;
  readonly headers: AngularHeaderObject[] = customIconsConfig.headers;
  readonly icons: IconsConfig = {
    sortUp: "\u25B2",
    sortDown: "\u25BC",
  };
}
