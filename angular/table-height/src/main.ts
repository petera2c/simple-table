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
  template: `<table-height-demo></table-height-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);