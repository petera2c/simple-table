import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { animationsConfig } from "./animations.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "animations-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [columnReordering]="true"
      [editColumns]="true"
      [editColumnsInitOpen]="true"
      (columnOrderChange)="onColumnOrderChange($event)"
    ></simple-table>
  `,
})
export class AnimationsDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = animationsConfig.rows;
  headers: AngularHeaderObject[] = [...animationsConfig.headers];

  onColumnOrderChange(newHeaders: AngularHeaderObject[]): void {
    this.headers = newHeaders;
  }
}
