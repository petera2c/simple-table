import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { animationsConfig } from "./animations.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "animations-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [columnReordering]="true"
      [enableColumnEditor]="true"
      [enableColumnEditorInitOpen]="true"
      (columnOrderChange)="onColumnOrderChange($event)"
    ></simple-table>
  `,
})
export class AnimationsDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = animationsConfig.rows;
  headers: AngularColumnDef[] = [...animationsConfig.headers];

  onColumnOrderChange(newHeaders: AngularColumnDef[]): void {
    this.headers = newHeaders;
  }
}
