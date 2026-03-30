import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { customThemeConfig } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";
import "../../../../shared/src/styles/custom-theme.css";

@Component({
  selector: "custom-theme-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
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
  readonly headers: AngularHeaderObject[] = customThemeConfig.headers;
  readonly customThemeOverrides = customThemeConfig.tableProps.customTheme;

  get resolvedTheme(): Theme {
    return this.theme ?? "custom";
  }
}
