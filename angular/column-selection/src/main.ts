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
  template: `<column-selection-demo></column-selection-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);