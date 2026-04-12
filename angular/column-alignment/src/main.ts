import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnAlignmentDemoComponent } from "./demos/column-alignment/column-alignment-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnAlignmentDemoComponent],
  template: `<column-alignment-demo height="500px"></column-alignment-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);