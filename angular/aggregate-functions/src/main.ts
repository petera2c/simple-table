import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { AggregateFunctionsDemoComponent } from "./demos/aggregate-functions/aggregate-functions-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AggregateFunctionsDemoComponent],
  template: `<aggregate-functions-demo height="500px"></aggregate-functions-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);