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
  template: `<div style="padding: 24px"><external-filter-demo height="500px"></external-filter-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);