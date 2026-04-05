import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ColumnPinningDemoComponent } from "./demos/column-pinning/column-pinning-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColumnPinningDemoComponent],
  template: `<div style="padding: 24px"><column-pinning-demo height="500px"></column-pinning-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);