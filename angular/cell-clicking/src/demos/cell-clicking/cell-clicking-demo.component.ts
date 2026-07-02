import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, CellClickProps, Theme } from "@simple-table/angular";
import { cellClickingData, cellClickingHeaders, CELL_CLICKING_STATUSES } from "./cell-clicking.demo-data";
import type { ProjectTask } from "./cell-clicking.demo-data";
import { CellClickDetailsCellComponent } from "./cell-click-details-cell.component";
import { CellClickPriorityCellComponent } from "./cell-click-priority-cell.component";
import { CellClickStatusCellComponent } from "./cell-click-status-cell.component";
import "@simple-table/angular/styles.css";

@Component({
  selector: "cell-clicking-demo",
  standalone: true,
  imports: [SimpleTableComponent, NgIf],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px">
      <div [style.padding]="'12px'" [style.background-color]="isDark ? '#374151' : '#f3f4f6'" [style.border-radius]="'8px'" [style.border]="'1px solid ' + (isDark ? '#4b5563' : '#d1d5db')" [style.min-height]="'48px'" style="display: flex; align-items: center">
        <strong [style.margin-right]="'8px'" [style.color]="isDark ? '#f9fafb' : '#1f2937'">Last Click:</strong>
        <span [style.color]="isDark ? '#d1d5db' : '#4b5563'">{{ clickInfo || 'Click any cell to see interaction details...' }}</span>
      </div>

      <div *ngIf="selectedTask" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000">
        <div [style.background]="isDark ? '#1f2937' : 'white'" style="padding: 24px; border-radius: 8px; max-width: 500px; width: 90%">
          <h3 [style.color]="isDark ? '#f9fafb' : '#1f2937'" style="margin: 0 0 16px">Task Details</h3>
          <p [style.color]="isDark ? '#d1d5db' : '#4b5563'" style="margin: 8px 0"><strong>Task:</strong> {{ selectedTask.task }}</p>
          <p [style.color]="isDark ? '#d1d5db' : '#4b5563'" style="margin: 8px 0"><strong>Details:</strong> {{ selectedTask.details }}</p>
          <p [style.color]="isDark ? '#d1d5db' : '#4b5563'" style="margin: 8px 0"><strong>Assignee:</strong> {{ selectedTask.assignee }}</p>
          <p [style.color]="isDark ? '#d1d5db' : '#4b5563'" style="margin: 8px 0"><strong>Status:</strong> {{ selectedTask.status }}</p>
          <p [style.color]="isDark ? '#d1d5db' : '#4b5563'" style="margin: 8px 0"><strong>Priority:</strong> {{ selectedTask.priority }}</p>
          <button (click)="selectedTask = null" style="margin-top: 16px; background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold">Close</button>
        </div>
      </div>

      <simple-table
        [columnResizing]="true"
        [defaultHeaders]="headers"
        [height]="height"
        [onCellClick]="handleCellClick"
        [rows]="rows"
        [theme]="theme"
      ></simple-table>
    </div>
  `,
})
export class CellClickingDemoComponent {
  @Input() height: string | number = "320px";
  @Input() theme?: Theme;

  clickInfo = "";
  selectedTask: ProjectTask | null = null;
  rows: ProjectTask[] = [...cellClickingData];

  get isDark() {
    return this.theme === "modern-dark" || this.theme === "dark";
  }

  readonly headers: AngularHeaderObject[] = cellClickingHeaders.map((h) => {
    if (h.accessor === "priority") {
      return { ...h, cellRenderer: CellClickPriorityCellComponent };
    }
    if (h.accessor === "status") {
      return { ...h, cellRenderer: CellClickStatusCellComponent };
    }
    if (h.accessor === "details") {
      return { ...h, cellRenderer: CellClickDetailsCellComponent };
    }
    return { ...h };
  });

  handleCellClick = ({ accessor, rowIndex, value, row }: CellClickProps) => {
    const task = row as ProjectTask;
    switch (accessor) {
      case "priority":
        this.clickInfo = `Filtering by ${value} priority`;
        this.rows = cellClickingData.filter((t) => t.priority === value);
        break;
      case "status": {
        const idx = CELL_CLICKING_STATUSES.indexOf(String(value));
        const next = CELL_CLICKING_STATUSES[(idx + 1) % CELL_CLICKING_STATUSES.length];
        this.rows = this.rows.map((t) => (t.id === task.id ? { ...t, status: next } : t));
        this.clickInfo = `Status: "${value}" → "${next}"`;
        break;
      }
      case "details":
        this.selectedTask = task;
        this.clickInfo = `Opening details for: ${task.task}`;
        break;
      case "estimatedHours": {
        const n = Math.min(task.estimatedHours + 2, 40);
        this.rows = this.rows.map((t) => (t.id === task.id ? { ...t, estimatedHours: n } : t));
        this.clickInfo = `Est. hours: ${task.estimatedHours}h → ${n}h`;
        break;
      }
      case "completedHours": {
        const n = Math.min(task.completedHours + 1, task.estimatedHours);
        this.rows = this.rows.map((t) => (t.id === task.id ? { ...t, completedHours: n } : t));
        this.clickInfo = `Done hours: ${task.completedHours}h → ${n}h`;
        break;
      }
      default:
        this.clickInfo = `Clicked [${accessor}] = "${value}" (row ${rowIndex})`;
    }
  };
}
