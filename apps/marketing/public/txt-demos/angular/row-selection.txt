import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme, RowSelectionChangeProps } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { rowSelectionConfig, rowSelectionData } from "@simple-table/examples-shared";
import type { LibraryBook } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "row-selection-demo",
  standalone: true,
  imports: [SimpleTableComponent],
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
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
        [enableRowSelection]="true"
        [columnResizing]="true"
        [columnReordering]="true"
        [selectableCells]="true"
        [onRowSelectionChange]="handleSelectionChange"
      ></simple-table>
    </div>
  `,
})
export class RowSelectionDemoComponent {
  @Input() height: string | number = "348px";
  @Input() theme?: Theme;

  readonly rows: Row[] = rowSelectionConfig.rows;
  readonly headers: AngularHeaderObject[] = rowSelectionConfig.headers.map((h) => {
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
          const s = String(row.status);
          const color = s === "Available" ? "#16a34a" : s === "Checked Out" ? "#ea580c" : "#dc2626";
          return `<span style="color:${color};font-weight:bold">${s}</span>`;
        },
      };
    }
    return { ...h };
  });

  selectedBooks: LibraryBook[] = [];

  get selectedTitles(): string {
    return this.selectedBooks.length > 0
      ? this.selectedBooks.map((b) => b.title).join(", ")
      : "None";
  }

  handleSelectionChange = (props: RowSelectionChangeProps): void => {
    this.selectedBooks = rowSelectionData.filter((book) =>
      props.selectedRows.has(String(book.id)),
    );
  };
}
