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
  template: `<external-sort-demo></external-sort-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);