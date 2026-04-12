import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { NestedHeadersDemoComponent } from "./demos/nested-headers/nested-headers-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [NestedHeadersDemoComponent],
  template: `<nested-headers-demo height="500px"></nested-headers-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);