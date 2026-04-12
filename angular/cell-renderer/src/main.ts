import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CellRendererDemoComponent } from "./demos/cell-renderer/cell-renderer-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CellRendererDemoComponent],
  template: `<cell-renderer-demo height="500px"></cell-renderer-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);