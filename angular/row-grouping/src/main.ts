import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { RowGroupingDemoComponent } from "./demos/row-grouping/row-grouping-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RowGroupingDemoComponent],
  template: `<div style="padding: 24px"><row-grouping-demo height="500px"></row-grouping-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);