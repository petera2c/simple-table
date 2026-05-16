import { ApplicationRef, Component, EnvironmentInjector, Input, inject } from "@angular/core";
import { SimpleTableComponent, wrapAngularRenderer } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { emptyStateConfig } from "./empty-state.demo-data";
import { TableEmptyStateComponent } from "./table-empty-state.component";
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

  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);

  readonly rows: Row[] = emptyStateConfig.rows;
  readonly headers: AngularHeaderObject[] = emptyStateConfig.headers;
  readonly emptyStateEl = wrapAngularRenderer(
    TableEmptyStateComponent,
    this.appRef,
    this.envInjector,
  )({});
}
