import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { DynamicNestedTablesDemoComponent } from "./demos/dynamic-nested-tables/dynamic-nested-tables-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [DynamicNestedTablesDemoComponent],
  template: `<div style="padding: 24px"><dynamic-nested-tables-demo height="500px"></dynamic-nested-tables-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);