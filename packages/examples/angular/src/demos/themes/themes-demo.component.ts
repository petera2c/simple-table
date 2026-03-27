import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { themesConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "themes-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class ThemesDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = themesConfig.rows;
  readonly headers: AngularHeaderObject[] = themesConfig.headers;
}
