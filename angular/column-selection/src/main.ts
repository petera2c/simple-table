import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnSelectionDemoComponent } from "./demos/column-selection/column-selection-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnSelectionDemoComponent],
  template: `<div style="padding: 24px"><column-selection-demo height="500px"></column-selection-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);