import { Component, Input } from "@angular/core";
import { SimpleTableImports } from "@simple-table/angular";
import type { AngularColumnDef, ColumnType, GetRowIdParams, SortColumn, Theme } from "@simple-table/angular";
import { externalSortConfig } from "./external-sort.demo-data";
import "@simple-table/angular/styles.css";
import type { SortableEmployee } from "./external-sort.demo-data";

type SortableKey = keyof SortableEmployee;

function isSortableKey(accessor: string): accessor is SortableKey {
  return (
    accessor === "id" ||
    accessor === "name" ||
    accessor === "age" ||
    accessor === "email" ||
    accessor === "salary" ||
    accessor === "department"
  );
}

type ActiveSort = {
  accessor: SortableKey;
  direction: "asc" | "desc";
  type?: ColumnType;
};

@Component({
  selector: "external-sort-demo",
  standalone: true,
  imports: [SimpleTableImports],
  template: `
    <div style="margin-bottom: 8px; font-size: 13px; color: #334155">
      <strong>Sort:</strong> {{ sortLabel }}
    </div>
    <simple-table
      [getRowId]="getRowId"
      [rows]="displayRows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [externalSortHandling]="true"
      [columnResizing]="true"
      (sortChange)="handleSortChange($event)"
    ></simple-table>
  `,
})
export class ExternalSortDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularColumnDef<SortableEmployee>[] = externalSortConfig.headers;
  sortLabel = "None";
  displayRows: SortableEmployee[] = [...externalSortConfig.rows];
  private activeSort: ActiveSort | null = null;

  handleSortChange = (sort: SortColumn | null): void => {
    if (!sort || !isSortableKey(sort.key.accessor)) {
      this.activeSort = null;
      this.sortLabel = "None";
    } else {
      this.activeSort = {
        accessor: sort.key.accessor,
        direction: sort.direction,
        type: sort.key.type,
      };
      this.sortLabel = `${sort.key.accessor} ${sort.direction}`;
    }
    this.displayRows = this.sortRows();
  };

  private sortRows(): SortableEmployee[] {
    const rows = [...externalSortConfig.rows];
    if (!this.activeSort) return rows;
    const { accessor, type, direction } = this.activeSort;
    return rows.sort((a, b) => {
      const aVal = a[accessor];
      const bVal = b[accessor];
      if (aVal === bVal) return 0;
      const cmp =
        type === "number"
          ? (Number(aVal) || 0) - (Number(bVal) || 0)
          : String(aVal).localeCompare(String(bVal));
      return direction === "asc" ? cmp : -cmp;
    });
  }

  getRowId = ({ row }: GetRowIdParams<SortableEmployee>) => row.id;
}
