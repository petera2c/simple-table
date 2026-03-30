import { NgIf } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row, HeaderObject } from "simple-table-core";
import { columnResizingHeaders, columnResizingData, COLUMN_RESIZING_STORAGE_KEY } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-resizing-demo",
  standalone: true,
  imports: [SimpleTableComponent, NgIf],
  template: `
    <div style="position: relative; height: 100%">
      <div
        *ngIf="saveMessage"
        style="position: absolute; top: 8px; right: 8px; background: #10b981; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
      >
        {{ saveMessage }}
      </div>
      <simple-table
        [columnResizing]="true"
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
        [onColumnWidthChange]="handleColumnWidthChange"
      ></simple-table>
    </div>
  `,
})
export class ColumnResizingDemoComponent implements OnInit {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnResizingData;
  headers: AngularHeaderObject[] = [...columnResizingHeaders];
  saveMessage = "";

  handleColumnWidthChange = (updatedHeaders: HeaderObject[]) => {
    try {
      const widthMap: Record<string, unknown> = {};
      for (const h of updatedHeaders) widthMap[h.accessor] = h.width;
      localStorage.setItem(COLUMN_RESIZING_STORAGE_KEY, JSON.stringify(widthMap));
      this.headers = updatedHeaders;
      this.saveMessage = "Column widths saved!";
      setTimeout(() => { this.saveMessage = ""; }, 2000);
    } catch {
      this.saveMessage = "Failed to save widths";
      setTimeout(() => { this.saveMessage = ""; }, 2000);
    }
  };

  ngOnInit() {
    try {
      const saved = localStorage.getItem(COLUMN_RESIZING_STORAGE_KEY);
      if (saved) {
        const widthMap = JSON.parse(saved);
        this.headers = columnResizingHeaders.map((h) => ({ ...h, width: widthMap[h.accessor] ?? h.width }));
      }
    } catch { /* ignore */ }
  }
}
