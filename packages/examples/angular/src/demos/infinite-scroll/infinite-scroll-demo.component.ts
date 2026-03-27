import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { infiniteScrollConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "infinite-scroll-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [onLoadMore]="handleLoadMore"
    ></simple-table>
  `,
})
export class InfiniteScrollDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = infiniteScrollConfig.headers;
  rows: Row[] = [...infiniteScrollConfig.rows];

  handleLoadMore = (): void => {
    const nextId = this.rows.length + 1;
    const newRows: Row[] = Array.from({ length: 20 }, (_, i) => ({
      id: nextId + i,
    }));
    this.rows = [...this.rows, ...newRows];
  };
}
