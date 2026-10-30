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
  template: `<column-pinning-demo></column-pinning-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);