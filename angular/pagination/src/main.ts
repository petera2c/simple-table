import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { PaginationDemoComponent } from "./demos/pagination/pagination-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [PaginationDemoComponent],
  template: `<div style="padding: 24px"><pagination-demo height="500px"></pagination-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);