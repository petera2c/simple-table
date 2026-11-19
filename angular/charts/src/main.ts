import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ChartsDemoComponent } from "./demos/charts/charts-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ChartsDemoComponent],
  template: `<charts-demo></charts-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);