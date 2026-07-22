import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { AnalyticsDemoComponent } from "./demos/analytics/analytics-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AnalyticsDemoComponent],
  template: `<analytics-demo></analytics-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);