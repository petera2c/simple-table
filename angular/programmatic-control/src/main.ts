import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { ProgrammaticControlDemoComponent } from "./demos/programmatic-control/programmatic-control-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ProgrammaticControlDemoComponent],
  template: `<programmatic-control-demo></programmatic-control-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);