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
  template: `<custom-theme-demo></custom-theme-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);