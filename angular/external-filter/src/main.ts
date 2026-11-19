import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ExternalFilterDemoComponent } from "./demos/external-filter/external-filter-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ExternalFilterDemoComponent],
  template: `<external-filter-demo></external-filter-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);