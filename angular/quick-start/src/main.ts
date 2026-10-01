import "@angular/compiler";
import "zone.js";
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideSimpleTable } from "@simple-table/angular";
import { QuickStartDemoComponent } from "./demos/quick-start/quick-start-demo.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [QuickStartDemoComponent],
  template: `<quick-start-demo></quick-start-demo>`,
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideSimpleTable()],
}).catch(console.error);