import { Component, Input } from "@angular/core";
import { SimpleTableImports } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, RowSelectionChangeProps, Theme } from "@simple-table/angular";
import type { LibraryBook } from "./row-selection.demo-data";
import { rowSelectionConfig, rowSelectionData } from "./row-selection.demo-data";
import "@simple-table/angular/styles.css";

const STATUS_COLOR: Record<string, string> = {
  Available: "#16a34a",
  "Checked Out": "#ea580c",
  Reserved: "#dc2626",
};

@Component({
  selector: "row-selection-demo",
  standalone: true,
  imports: [SimpleTableImports],
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="padding: 12px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd">
        <div style="font-weight: bold; margin-bottom: 4px; color: #0c4a6e">
          Library Management Demo
        </div>
        <div style="font-size: 13px; color: #475569; margin-bottom: 6px">
          Click rows to select books. Use the checkbox column to select multiple.
        </div>
        <div style="font-size: 13px; color: #334155">
          <strong>Selected Books: </strong>{{ selectedTitles }}
        </div>
      </div>

      <simple-table
        [getRowId]="getRowId"
        [rows]="rows"
        [columns]="headers"
        [height]="height"
        [theme]="theme"
        [enableRowSelection]="true"
        [columnResizing]="true"
        [columnReordering]="true"
        [selectableCells]="true"
        (rowSelectionChange)="handleSelectionChange($event)"
      >
        <ng-template stCell="status" let-value="value">
          <span [style.color]="statusColor(value)" style="font-weight:bold">{{ value }}</span>
        </ng-template>
      </simple-table>
    </div>
  `,
})
export class RowSelectionDemoComponent {
  @Input() height: string | number = "348px";
  @Input() theme?: Theme;

  readonly rows: LibraryBook[] = rowSelectionConfig.rows;
  readonly headers: AngularColumnDef<LibraryBook>[] = rowSelectionConfig.headers;

  selectedBooks: LibraryBook[] = [];
  private readonly selectedIds = new Set<number>();

  get selectedTitles(): string {
    return this.selectedBooks.length > 0
      ? this.selectedBooks.map((b) => b.title).join(", ")
      : "None";
  }

  statusColor(value: unknown): string {
    return STATUS_COLOR[String(value)] ?? "#dc2626";
  }

  handleSelectionChange(event: RowSelectionChangeProps<LibraryBook>): void {
    if (event.isSelected) {
      this.selectedIds.add(event.row.id);
    } else {
      this.selectedIds.delete(event.row.id);
    }
    this.selectedBooks = rowSelectionData.filter((book) => this.selectedIds.has(book.id));
  }

  getRowId = ({ row }: GetRowIdParams<LibraryBook>) => row.id;
}
