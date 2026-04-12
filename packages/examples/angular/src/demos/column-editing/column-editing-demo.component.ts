import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { columnEditingData, columnEditingHeaders } from "./column-editing.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-editing-demo",
  standalone: true,
  imports: [SimpleTableComponent, NgIf],
  template: `
    <div>
      <div style="margin-bottom: 12px">
        <button
          (click)="addColumn()"
          style="background-color: #007bff; color: white; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 13px;"
        >
          + Add Column
        </button>
        <span *ngIf="lastAdded" style="margin-left: 12px; color: #64748b; font-size: 13px;">
          Added: {{ lastAdded }}
        </span>
      </div>
      <simple-table
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
        [enableHeaderEditing]="true"
        [selectableColumns]="true"
        [onHeaderEdit]="handleHeaderEdit"
      ></simple-table>
    </div>
  `,
})
export class ColumnEditingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnEditingData;
  additionalColumns: AngularHeaderObject[] = [];
  lastAdded = "";

  get headers(): AngularHeaderObject[] {
    return [...columnEditingHeaders, ...this.additionalColumns];
  }

  addColumn() {
    const n = this.additionalColumns.length + 1;
    const col: AngularHeaderObject = { accessor: `custom-${n}`, label: `Custom ${n}`, width: 120, type: "string" };
    this.additionalColumns = [...this.additionalColumns, col];
    this.lastAdded = col.label;
  }

  handleHeaderEdit = (_header: AngularHeaderObject, newLabel: string) => {
    this.lastAdded = `Renamed to: ${newLabel}`;
  };
}
