import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { LoadingStateDemoComponent } from "./demos/loading-state/loading-state-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [LoadingStateDemoComponent],
  template: `<div style="padding: 24px"><loading-state-demo height="500px"></loading-state-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);