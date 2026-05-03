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
  template: `<cell-clicking-demo></cell-clicking-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);