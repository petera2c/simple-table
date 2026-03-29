import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row, QuickFilterMode } from "simple-table-core";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "quick-filter-demo",
  standalone: true,
  imports: [SimpleTableComponent, FormsModule],
  template: `
    <div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; align-items: center">
        <input
          type="text"
          placeholder="Search..."
          [(ngModel)]="searchText"
          style="padding: 6px 12px; border-radius: 6px; border: 1px solid #d1d5db; font-size: 13px; min-width: 200px"
        />
        <button
          (click)="filterMode = 'simple'"
          [style.padding]="'6px 14px'"
          [style.borderRadius]="'6px'"
          [style.border]="filterMode === 'simple' ? '2px solid #3b82f6' : '1px solid #d1d5db'"
          [style.background]="filterMode === 'simple' ? '#eff6ff' : '#fff'"
          [style.color]="filterMode === 'simple' ? '#1d4ed8' : '#374151'"
          [style.fontWeight]="filterMode === 'simple' ? 600 : 400"
          [style.cursor]="'pointer'"
          [style.fontSize]="'13px'"
        >
          Simple
        </button>
        <button
          (click)="filterMode = 'smart'"
          [style.padding]="'6px 14px'"
          [style.borderRadius]="'6px'"
          [style.border]="filterMode === 'smart' ? '2px solid #3b82f6' : '1px solid #d1d5db'"
          [style.background]="filterMode === 'smart' ? '#eff6ff' : '#fff'"
          [style.color]="filterMode === 'smart' ? '#1d4ed8' : '#374151'"
          [style.fontWeight]="filterMode === 'smart' ? 600 : 400"
          [style.cursor]="'pointer'"
          [style.fontSize]="'13px'"
        >
          Smart
        </button>
        <button
          (click)="caseSensitive = !caseSensitive"
          [style.padding]="'6px 14px'"
          [style.borderRadius]="'6px'"
          [style.border]="caseSensitive ? '2px solid #3b82f6' : '1px solid #d1d5db'"
          [style.background]="caseSensitive ? '#eff6ff' : '#fff'"
          [style.color]="caseSensitive ? '#1d4ed8' : '#374151'"
          [style.fontWeight]="caseSensitive ? 600 : 400"
          [style.cursor]="'pointer'"
          [style.fontSize]="'13px'"
        >
          Case Sensitive
        </button>
      </div>
      <simple-table
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
        [quickFilter]="{ text: searchText, mode: filterMode, caseSensitive: caseSensitive }"
      ></simple-table>
    </div>
  `,
})
export class QuickFilterDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = quickFilterConfig.rows;
  readonly headers: AngularHeaderObject[] = quickFilterConfig.headers;
  searchText = "";
  filterMode: QuickFilterMode = "simple";
  caseSensitive = false;
}
