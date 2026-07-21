import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { quickStartConfig } from "./quick-start.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "quick-start-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [enableColumnEditor]="enableColumnEditorProp"
      [selectableCells]="selectableCellsProp"
      [customTheme]="customTheme"
    ></simple-table>
  `,
})
export class QuickStartDemoComponent {
  @Input() height: string | number = "300px";
  @Input() theme?: Theme;

  readonly rows: Row[] = quickStartConfig.rows;
  readonly headers: AngularColumnDef[] = quickStartConfig.headers;
  readonly enableColumnEditorProp = quickStartConfig.tableProps.enableColumnEditor;
  readonly selectableCellsProp = quickStartConfig.tableProps.selectableCells;
  readonly customTheme = quickStartConfig.tableProps.customTheme;
}
