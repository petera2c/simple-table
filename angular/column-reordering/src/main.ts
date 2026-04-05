import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnReorderingDemoComponent } from "./demos/column-reordering/column-reordering-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnReorderingDemoComponent],
  template: `<div style="padding: 24px"><column-reordering-demo height="500px"></column-reordering-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);