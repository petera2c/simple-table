import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { SpreadsheetDemoComponent } from "./demos/spreadsheet/spreadsheet-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [SpreadsheetDemoComponent],
  template: `<spreadsheet-demo height="500px"></spreadsheet-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);