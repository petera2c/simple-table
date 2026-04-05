import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { EmptyStateDemoComponent } from "./demos/empty-state/empty-state-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [EmptyStateDemoComponent],
  template: `<div style="padding: 24px"><empty-state-demo height="500px"></empty-state-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);