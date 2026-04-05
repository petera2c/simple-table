import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ExternalSortDemoComponent } from "./demos/external-sort/external-sort-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ExternalSortDemoComponent],
  template: `<div style="padding: 24px"><external-sort-demo height="500px"></external-sort-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);