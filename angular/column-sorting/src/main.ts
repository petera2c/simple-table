import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnSortingDemoComponent } from "./demos/column-sorting/column-sorting-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnSortingDemoComponent],
  template: `<div style="padding: 24px"><column-sorting-demo height="500px"></column-sorting-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);