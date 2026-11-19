import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, AngularIconsConfig, GetRowIdParams, Theme } from "@simple-table/angular";
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
import type { SoftwareRelease } from "./custom-icons.demo-data";

@Component({
  selector: "custom-icons-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [icons]="icons"
    ></simple-table>
  `,
})
export class CustomIconsDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: SoftwareRelease[] = customIconsConfig.rows;
  readonly headers: AngularColumnDef<SoftwareRelease>[] = customIconsConfig.headers;
  readonly icons: AngularIconsConfig = {
    sortUp: DemoSortUpIconComponent,
    sortDown: DemoSortDownIconComponent,
    filter: DemoFilterIconComponent,
    expand: DemoExpandIconComponent,
    next: DemoNextIconComponent,
    prev: DemoPrevIconComponent,
  };

  getRowId = ({ row }: GetRowIdParams<SoftwareRelease>) => row.id;
}
