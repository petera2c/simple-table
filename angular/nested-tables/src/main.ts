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
  template: `<nested-tables-demo></nested-tables-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);