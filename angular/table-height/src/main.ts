import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { TableHeightDemoComponent } from "./demos/table-height/table-height-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [TableHeightDemoComponent],
  template: `<div style="padding: 24px"><table-height-demo height="500px"></table-height-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);