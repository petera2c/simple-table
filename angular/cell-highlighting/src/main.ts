import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CellHighlightingDemoComponent } from "./demos/cell-highlighting/cell-highlighting-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CellHighlightingDemoComponent],
  template: `<cell-highlighting-demo height="500px"></cell-highlighting-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);