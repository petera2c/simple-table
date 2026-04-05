import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { NestedTablesDemoComponent } from "./demos/nested-tables/nested-tables-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [NestedTablesDemoComponent],
  template: `<div style="padding: 24px"><nested-tables-demo height="500px"></nested-tables-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);