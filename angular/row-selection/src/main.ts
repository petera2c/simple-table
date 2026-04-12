import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { RowSelectionDemoComponent } from "./demos/row-selection/row-selection-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RowSelectionDemoComponent],
  template: `<row-selection-demo height="500px"></row-selection-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);