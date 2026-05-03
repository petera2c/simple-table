import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { QuickFilterDemoComponent } from "./demos/quick-filter/quick-filter-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [QuickFilterDemoComponent],
  template: `<quick-filter-demo></quick-filter-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);