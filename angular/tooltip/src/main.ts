import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { TooltipDemoComponent } from "./demos/tooltip/tooltip-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [TooltipDemoComponent],
  template: `<tooltip-demo height="500px"></tooltip-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);