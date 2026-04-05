import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CellClickingDemoComponent } from "./demos/cell-clicking/cell-clicking-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CellClickingDemoComponent],
  template: `<div style="padding: 24px"><cell-clicking-demo height="500px"></cell-clicking-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);