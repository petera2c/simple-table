import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnResizingDemoComponent } from "./demos/column-resizing/column-resizing-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnResizingDemoComponent],
  template: `<column-resizing-demo height="500px"></column-resizing-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);