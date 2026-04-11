import { Component, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { programmaticControlConfig, PROGRAMMATIC_CONTROL_STATUS_COLORS } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "programmatic-control-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="margin-bottom: 12px; padding: 8px 12px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; color: #1e40af; font-size: 14px">
        {{ statusMessage }}
      </div>
      <div style="margin-bottom: 12px; display: flex; gap: 8px; flex-wrap: wrap">
        <button (click)="sortByName()">Sort by Name (A-Z)</button>
        <button (click)="sortByPrice()">Sort by Price (High to Low)</button>
        <button (click)="filterAvailable()">Filter: Available</button>
        <button (click)="clearFilters()">Clear Filters</button>
        <button (click)="getInfo()">Get Table Info</button>
      </div>
      <simple-table
        #simpleTable
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
      ></simple-table>
    </div>
  `,
})
export class ProgrammaticControlDemoComponent {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  statusMessage = "No status message";
  readonly rows: Row[] = programmaticControlConfig.rows;
  readonly headers: AngularHeaderObject[] = programmaticControlConfig.headers.map((h) => {
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
          const s = String(row.status);
          const colors = PROGRAMMATIC_CONTROL_STATUS_COLORS[s] ?? { bg: "#f3f4f6", color: "#374151" };
          return `<span style="background:${colors.bg};color:${colors.color};padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold">${s}</span>`;
        },
      };
    }
    return { ...h };
  });

  sortByName(): void {
    this.tableRef.getAPI()?.applySortState({ accessor: "name", direction: "asc" });
    this.statusMessage = "Sorted by Name (A-Z)";
  }

  sortByPrice(): void {
    this.tableRef.getAPI()?.applySortState({ accessor: "price", direction: "desc" });
    this.statusMessage = "Sorted by Price (High to Low)";
  }

  filterAvailable(): void {
    this.tableRef.getAPI()?.applyFilter({ accessor: "status", operator: "equals", value: "Available" });
    this.statusMessage = "Filtered to show only Available products";
  }

  clearFilters(): void {
    this.tableRef.getAPI()?.clearAllFilters();
    this.statusMessage = "All filters cleared";
  }

  getInfo(): void {
    const api = this.tableRef.getAPI();
    if (!api) return;
    const allRows = api.getAllRows();
    const hdrs = api.getHeaders();
    const sortState = api.getSortState();
    const filterState = api.getFilterState();
    const totalValue = allRows.reduce((sum, r) => sum + (r.price as number) * (r.stock as number), 0);
    const sortInfo = sortState ? `${sortState.key.label} (${sortState.direction})` : "None";
    alert(
      `Table Info:\n• Rows: ${allRows.length}\n• Columns: ${hdrs.length}\n• Active filters: ${Object.keys(filterState).length}\n• Sort: ${sortInfo}\n• Total inventory value: $${totalValue.toFixed(2)}`,
    );
    this.statusMessage = "Table info displayed";
  }
}
