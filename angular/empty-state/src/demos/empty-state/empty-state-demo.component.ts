import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { emptyStateConfig, buildEmptyStateElement } from "./empty-state.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "empty-state-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [tableEmptyStateRenderer]="emptyStateEl"
    ></simple-table>
  `,
})
export class EmptyStateDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = emptyStateConfig.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(emptyStateConfig.headers);
  readonly emptyStateEl = buildEmptyStateElement();
}
