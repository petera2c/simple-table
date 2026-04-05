import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnFilteringDemoComponent } from "./demos/column-filtering/column-filtering-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnFilteringDemoComponent],
  template: `<div style="padding: 24px"><column-filtering-demo height="500px"></column-filtering-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);