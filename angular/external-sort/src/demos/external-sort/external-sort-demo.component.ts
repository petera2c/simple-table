import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";import type { AngularColumnDef, ColumnType, GetRowIdParams, SortColumn, Theme } from "@simple-table/angular";
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
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="sortedRows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [externalSortHandling]="true"
      [columnResizing]="true"
      [onSortChange]="handleSortChange"
    ></simple-table>
  `,
})
export class ExternalSortDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularColumnDef<SortableEmployee>[] = externalSortConfig.headers;
  private activeSort: ActiveSort | null = null;

  handleSortChange = (sort: SortColumn | null): void => {
    if (!sort || !isSortableKey(sort.key.accessor)) {
      this.activeSort = null;
    } else {
      this.activeSort = {
        accessor: sort.key.accessor,
        direction: sort.direction,
        type: sort.key.type,
      };
    }
  };

  get sortedRows(): SortableEmployee[] {
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
