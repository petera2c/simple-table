import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { LiveUpdateDemoComponent } from "./demos/live-update/live-update-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [LiveUpdateDemoComponent],
  template: `<live-update-demo></live-update-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);