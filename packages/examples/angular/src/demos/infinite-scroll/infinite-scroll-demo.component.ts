import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { infiniteScrollConfig, generateInfiniteScrollData } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const MAX_ROWS = 200;
const BATCH_SIZE = 15;

@Component({
  selector: "infinite-scroll-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: #666">
        {{ rows.length }} rows loaded{{ hasMore ? '' : ' (all loaded)' }}
      </div>
      <simple-table
        [rows]="rows"
        [defaultHeaders]="headers"
        [isLoading]="loading"
        [height]="height"
        [theme]="theme"
        [onLoadMore]="handleLoadMore"
      ></simple-table>
    </div>
  `,
})
export class InfiniteScrollDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = infiniteScrollConfig.headers;
  rows: Row[] = generateInfiniteScrollData(0, 30) as Row[];
  loading = false;
  hasMore = true;

  handleLoadMore = () => {
    if (this.loading || !this.hasMore) return;
    this.loading = true;
    setTimeout(() => {
      const newRows = generateInfiniteScrollData(this.rows.length, BATCH_SIZE) as Row[];
      this.rows = [...this.rows, ...newRows];
      if (this.rows.length >= MAX_ROWS) this.hasMore = false;
      this.loading = false;
    }, 500);
  };
}
