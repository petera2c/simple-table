import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, AngularIconsConfig, Row, Theme } from "@simple-table/angular";
import { customIconsConfig } from "./custom-icons.demo-data";
import {
  DemoExpandIconComponent,
  DemoFilterIconComponent,
  DemoNextIconComponent,
  DemoPrevIconComponent,
  DemoSortDownIconComponent,
  DemoSortUpIconComponent,
} from "./table-icons.components";
import "@simple-table/angular/styles.css";

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
  readonly icons: AngularIconsConfig = {
    sortUp: DemoSortUpIconComponent,
    sortDown: DemoSortDownIconComponent,
    filter: DemoFilterIconComponent,
    expand: DemoExpandIconComponent,
    next: DemoNextIconComponent,
    prev: DemoPrevIconComponent,
  };
}
