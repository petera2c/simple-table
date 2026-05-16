import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import {
  generateWindowScrollRows,
  windowScrollHeaders,
} from "./window-infinite-scroll.demo-data";
import "@simple-table/angular/styles.css";

const INITIAL_ROWS = 50;
const BATCH_SIZE = 50;
const MAX_ROWS = 5_000;
const LOAD_DELAY_MS = 350;

/**
 * Window-style infinite scroll demo.
 *
 * The table has no `height` / `maxHeight` — it grows to its natural size inside
 * whatever scroll parent surrounds it. `scrollParent` is a getter that resolves
 * to the nearest scrollable ancestor at render time (the demo shell wraps
 * everything in a scrollable `<main>`, so `window` itself doesn't scroll inside
 * this preview). In a typical app you'd just pass `scrollParent="window"`.
 *
 * As the user scrolls toward the bottom, `onLoadMore` appends a batch of rows
 * until the dataset cap is reached.
 */
@Component({
  selector: "window-infinite-scroll-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div #wrapper style="max-width: 1100px; margin: 0 auto">
      <h1 style="font-size: 28px; margin: 0 0 12px 0; color: #0f172a">
        Window-Scroll Infinite Loading
      </h1>
      <p
        style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0"
      >
        This table has no <code>height</code> or <code>maxHeight</code>. It grows to its natural
        size inside the page, and uses the outer scroll container (<code>scrollParent</code>) to
        drive both row virtualization and <code>onLoadMore</code>. The header pins to the top of
        the outer scroll viewport as you scroll. Scroll down — new rows stream in as you approach
        the bottom.
      </p>

      <div
        style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; margin-bottom: 16px; background: #eef2ff; color: #3730a3; border-radius: 999px; font-size: 13px; font-weight: 500"
      >
        <span
          style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #6366f1"
        ></span>
        <span>{{ statusLabel }}</span>
      </div>

      <simple-table
        [defaultHeaders]="headers"
        [rows]="rows"
        [theme]="theme"
        [getRowId]="getRowId"
        [scrollParent]="getScrollParent"
        [infiniteScrollThreshold]="400"
        [onLoadMore]="handleLoadMore"
        [isLoading]="loading && rows.length === 0"
      ></simple-table>

      <p
        style="font-size: 13px; color: #94a3b8; margin: 24px 0 48px 0; text-align: center"
      >
        End of demo content. Keep scrolling near the bottom and onLoadMore will keep firing until
        the dataset is exhausted.
      </p>
    </div>
  `,
})
export class WindowInfiniteScrollDemoComponent {
  // `height` is intentionally ignored — this demo is about *not* setting one.
  // We accept the input to match the demo registry signature.
  @Input() height?: string | number;
  @Input() theme?: Theme;

  @ViewChild("wrapper", { static: true })
  wrapperRef!: ElementRef<HTMLDivElement>;

  readonly headers: AngularHeaderObject[] = windowScrollHeaders;
  rows: Row[] = generateWindowScrollRows(0, INITIAL_ROWS);
  loading = false;
  hasMore = true;

  get statusLabel(): string {
    if (this.loading) return "Loading more rows…";
    if (this.hasMore) {
      return `${this.rows.length.toLocaleString()} rows loaded · scroll for more`;
    }
    return `${this.rows.length.toLocaleString()} rows loaded · end of dataset`;
  }

  // Getter form so we resolve the wrapper's scroll parent at render time.
  // In a regular app outside this preview shell, pass `"window"` instead.
  getScrollParent = () => this.wrapperRef?.nativeElement?.parentElement ?? null;

  getRowId = (p: { row: Row }) => String((p.row as { id?: number })?.id);

  handleLoadMore = () => {
    if (this.loading || !this.hasMore) return;
    this.loading = true;

    setTimeout(() => {
      const next = generateWindowScrollRows(this.rows.length, BATCH_SIZE);
      const updated = [...this.rows, ...next];
      if (updated.length >= MAX_ROWS) {
        this.hasMore = false;
        this.rows = updated.slice(0, MAX_ROWS);
      } else {
        this.rows = updated;
      }
      this.loading = false;
    }, LOAD_DELAY_MS);
  };
}
