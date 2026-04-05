import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ManufacturingDemoComponent } from "./demos/manufacturing/manufacturing-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ManufacturingDemoComponent],
  template: `<div style="padding: 24px"><manufacturing-demo height="500px"></manufacturing-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);