import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { DynamicRowLoadingDemoComponent } from "./demos/dynamic-row-loading/dynamic-row-loading-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [DynamicRowLoadingDemoComponent],
  template: `<dynamic-row-loading-demo height="500px"></dynamic-row-loading-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);