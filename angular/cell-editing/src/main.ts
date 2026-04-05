import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CellEditingDemoComponent } from "./demos/cell-editing/cell-editing-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CellEditingDemoComponent],
  template: `<div style="padding: 24px"><cell-editing-demo height="500px"></cell-editing-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);