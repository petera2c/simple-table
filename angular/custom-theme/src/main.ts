import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { CustomThemeDemoComponent } from "./demos/custom-theme/custom-theme-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CustomThemeDemoComponent],
  template: `<div style="padding: 24px"><custom-theme-demo height="500px"></custom-theme-demo></div>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);