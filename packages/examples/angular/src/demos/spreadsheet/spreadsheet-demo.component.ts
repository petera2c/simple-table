import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, CellChangeProps, Theme } from "@simple-table/angular";
import { recalculateAmortization, spreadsheetConfig } from "./spreadsheet.demo-data";
import type { SpreadsheetRow } from "./spreadsheet.demo-data";
import { setSpreadsheetAddColumnHandler } from "./spreadsheet-add-column-bridge";
import { SpreadsheetAddColumnHeaderComponent } from "./spreadsheet-add-column-header.component";
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
export class SpreadsheetDemoComponent implements OnInit, OnDestroy {
  @ViewChild("simpleTable") tableRef!: SimpleTableComponent;
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  data = [...spreadsheetConfig.rows];
  additionalColumns: AngularHeaderObject[] = [];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    setSpreadsheetAddColumnHandler(() => {
      const totalCols = spreadsheetConfig.headers.length + this.additionalColumns.length;
      const newCol: AngularHeaderObject = {
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
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    setSpreadsheetAddColumnHandler(null);
  }

  get headers(): AngularHeaderObject[] {
    return [
      ...spreadsheetConfig.headers,
      ...this.additionalColumns,
      {
        accessor: "actions",
        label: "",
        width: 100,
        minWidth: 100,
        filterable: false,
        type: "other" as const,
        disableReorder: true,
        headerRenderer: SpreadsheetAddColumnHeaderComponent,
      },
    ];
  }

  onCellEdit({ accessor, newValue, row }: CellChangeProps): void {
    this.data = this.data.map((item) => {
      if (item.id === row.id) {
        return recalculateAmortization(
          item as SpreadsheetRow,
          accessor,
          newValue as string | number,
        );
      }
      return item;
    });
  }
}
