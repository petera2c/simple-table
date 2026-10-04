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
  template: `<manufacturing-demo></manufacturing-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);