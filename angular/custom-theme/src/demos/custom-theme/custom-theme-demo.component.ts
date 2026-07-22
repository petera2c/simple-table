import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { customThemeConfig } from "./custom-theme.demo-data";
import "@simple-table/angular/styles.css";
import "./custom-theme.css";

@Component({
  selector: "custom-theme-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="resolvedTheme"
      [customTheme]="customThemeOverrides"
      [columnResizing]="true"
      [selectableCells]="true"
    ></simple-table>
  `,
})
export class CustomThemeDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = customThemeConfig.rows;
  readonly headers: AngularColumnDef[] = customThemeConfig.headers;
  readonly customThemeOverrides = customThemeConfig.tableProps.customTheme;

  get resolvedTheme(): Theme {
    return this.theme ?? "custom";
  }
}
