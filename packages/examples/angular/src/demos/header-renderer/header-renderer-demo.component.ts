import { Component, computed, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { headerDemoSortAccessor, headerDemoSortDirection } from "./header-demo-sort";
import { headerRendererConfig } from "./header-renderer.demo-data";
import { HeaderSortableHeaderComponent } from "./header-sortable-header.component";
import "@simple-table/angular/styles.css";

@Component({
  selector: "header-renderer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="sortedData()"
      [defaultHeaders]="headers()"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class HeaderRendererDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly sortedData = computed(() => {
    const acc = headerDemoSortAccessor();
    const dir = headerDemoSortDirection();
    if (!acc || !dir) return [...headerRendererConfig.rows];
    return [...headerRendererConfig.rows].sort((a, b) => {
      const aVal = a[acc];
      const bVal = b[acc];
      if (aVal === bVal) return 0;
      const cmp =
        typeof aVal === "number" && typeof bVal === "number"
          ? (aVal as number) - (bVal as number)
          : String(aVal).localeCompare(String(bVal));
      return dir === "asc" ? cmp : -cmp;
    });
  });

  readonly headers = computed((): AngularHeaderObject[] =>
    headerRendererConfig.headers.map((h) => ({
      ...h,
      isSortable: false,
      headerRenderer: HeaderSortableHeaderComponent,
    })),
  );
}
