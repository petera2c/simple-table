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
  template: `<column-sorting-demo></column-sorting-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);