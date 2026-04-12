import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnWidthDemoComponent } from "./demos/column-width/column-width-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnWidthDemoComponent],
  template: `<column-width-demo height="500px"></column-width-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);