import { Component, Input, ViewChild } from "@angular/core";
import { SimpleTableComponent, mapToAngularHeaderObjects } from "@simple-table/angular";
import type { AngularHeaderObject, CellChangeProps, HeaderObject, HeaderRenderer, Theme } from "@simple-table/angular";
import { spreadsheetConfig, recalculateAmortization } from "./spreadsheet.demo-data";
import type { SpreadsheetRow } from "./spreadsheet.demo-data";
import "@simple-table/angular/styles.css";
import "./spreadsheet-custom.css";

@Component({
  selector: "spreadsheet-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div class="spreadsheet-container">
      <simple-table
        #simpleTable
        [defaultHeaders]="headers"
        [rows]="data"
        [height]="height"
        [theme]="theme"
        [columnBorders]="true"
        [columnReordering]="true"
        [columnResizing]="true"
        [enableHeaderEditing]="true"
        [enableRowSelection]="true"
        [selectableCells]="true"
        [selectableColumns]="true"
        [useOddEvenRowBackground]="true"
        [customTheme]="{ rowHeight: 22 }"
        (cellEdit)="onCellEdit($event)"
      ></simple-table>
    </div>
  `,
})
export class SpreadsheetDemoComponent {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  data = [...spreadsheetConfig.rows];
  private additionalColumns: HeaderObject[] = [];

  get headers(): AngularHeaderObject[] {
    return this.buildHeaders();
  }

  private buildHeaders(): AngularHeaderObject[] {
    const baseHeaders: HeaderObject[] = [...spreadsheetConfig.headers];
    const addColumnHeaderRenderer: HeaderRenderer = () => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "center";

      const btn = document.createElement("button");
      btn.textContent = "+ Add Column";
      Object.assign(btn.style, {
        color: "white",
        border: "none",
        padding: "4px 10px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "11px",
        fontWeight: "500",
        whiteSpace: "nowrap",
      } satisfies Partial<CSSStyleDeclaration>);

      btn.addEventListener("click", () => {
        const totalCols = spreadsheetConfig.headers.length + this.additionalColumns.length;
        const newCol: HeaderObject = {
          accessor: `column${totalCols + 1}`,
          label: `Column ${totalCols + 1}`,
          width: 120,
          minWidth: 80,
          type: "number",
          align: "right",
          isEditable: true,
          aggregation: { type: "sum" },
        };
        this.additionalColumns = [...this.additionalColumns, newCol];
      });

      div.appendChild(btn);
      return div;
    };

    return mapToAngularHeaderObjects([
      ...baseHeaders,
      ...this.additionalColumns,
      {
        accessor: "actions",
        label: "",
        width: 100,
        minWidth: 100,
        filterable: false,
        type: "other" as const,
        disableReorder: true,
        headerRenderer: addColumnHeaderRenderer as any,
      },
    ]);
  }

  onCellEdit({ accessor, newValue, row }: CellChangeProps): void {
    this.data = this.data.map((item) => {
      if (item.id === row.id) {
        return recalculateAmortization(item as SpreadsheetRow, accessor, newValue as string | number);
      }
      return item;
    });
  }
}
