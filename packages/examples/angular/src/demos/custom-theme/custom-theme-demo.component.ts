import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { customThemeConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

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
      [customTheme]="{ rowHeight: 40, headerHeight: 44 }"
    ></simple-table>
  `,
})
export class CustomThemeDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = customThemeConfig.rows;
  readonly headers: AngularHeaderObject[] = customThemeConfig.headers;

  get resolvedTheme(): Theme {
    return this.theme ?? "custom";
  }
}
