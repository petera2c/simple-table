import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CollapsibleColumnsDemoComponent } from "./demos/collapsible-columns/collapsible-columns-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CollapsibleColumnsDemoComponent],
  template: `<div style="padding: 24px"><collapsible-columns-demo height="500px"></collapsible-columns-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);